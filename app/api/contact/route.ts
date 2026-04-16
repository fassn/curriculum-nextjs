import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { jsonError } from '@/app/lib/api-response'
import { getClientIp } from '@/app/lib/request-ip'
import { logError } from '@/app/lib/logger'
import { createRateLimiter } from '@/app/lib/rate-limit'
import { parseContactPayload } from '@/app/lib/validation'

export const runtime = 'nodejs'

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 5
const contactRateLimiter = createRateLimiter({
    prefix: 'contact-form',
    windowMs: RATE_LIMIT_WINDOW_MS,
    maxRequests: RATE_LIMIT_MAX_REQUESTS,
})

function sanitizeHeaderValue(value: string): string {
    return value.replace(/[\r\n]+/g, ' ').trim()
}

async function verifyRecaptcha(token: string): Promise<{ ok: true } | { ok: false; error: string }> {
    const recaptchaSecret = process.env.RECAPTCHA_SECRET
    if (!recaptchaSecret) {
        return { ok: false, error: 'Captcha is not configured on the server.' }
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            secret: recaptchaSecret,
            response: token,
        }),
    }).catch(() => null)

    if (!response || !response.ok) {
        return { ok: false, error: 'Captcha verification failed.' }
    }

    const data = (await response.json()) as {
        success?: boolean
        score?: number
        action?: string
    }

    const minScore = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5')
    if (!data.success) {
        return { ok: false, error: 'Captcha validation did not pass.' }
    }

    if (typeof data.score !== 'number' || data.score < minScore) {
        return { ok: false, error: 'Captcha score is too low.' }
    }

    if (data.action && data.action !== 'contact_form_submit') {
        return { ok: false, error: 'Captcha action is invalid.' }
    }

    return { ok: true }
}

export async function POST(request: Request) {
    const clientIp = getClientIp(request)
    const rateLimitResult = await contactRateLimiter.check(clientIp)
    if (rateLimitResult.limited) {
        return jsonError('Too many requests. Please try again in a few minutes.', 429, {
            headers: rateLimitResult.retryAfterSeconds
                ? { 'Retry-After': String(rateLimitResult.retryAfterSeconds) }
                : undefined,
        })
    }

    const body = await request.json().catch(() => null)
    const parsedPayload = parseContactPayload(body)
    if (!parsedPayload.ok) {
        return jsonError(parsedPayload.error, 400)
    }
    const payload = parsedPayload.data

    const recaptchaValidation = await verifyRecaptcha(payload.recaptchaToken)
    if (!recaptchaValidation.ok) {
        return jsonError(recaptchaValidation.error, 400)
    }

    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const toEmail = process.env.CONTACT_TO_EMAIL
    const fromEmail = process.env.CONTACT_FROM_EMAIL

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !toEmail || !fromEmail) {
        return jsonError('Email service is not configured on the server.', 500)
    }

    const port = Number(smtpPort)
    if (!Number.isInteger(port) || port <= 0) {
        return jsonError('Server email configuration is invalid (SMTP_PORT).', 500)
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure: port === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    })

    const subject = sanitizeHeaderValue(payload.title)
    const sender = sanitizeHeaderValue(payload.email)

    try {
        await transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            replyTo: sender,
            subject: `[Contact] ${subject}`,
            text: [
                `From: ${sender}`,
                `Title: ${subject}`,
                '',
                payload.message,
            ].join('\n'),
        })
    } catch (error) {
        logError('contact.send_failed', error, { clientIp })
        return jsonError('Could not send your message right now. Please try again.', 502)
    }

    return NextResponse.json({ success: true })
}
