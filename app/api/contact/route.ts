import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { getClientIp } from '@/app/lib/request-ip'
import { createRateLimiter } from '@/app/lib/rate-limit'

export const runtime = 'nodejs'

type ContactPayload = {
    email: string
    title: string
    message: string
    recaptchaToken: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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

function validatePayload(payload: ContactPayload): string | null {
    if (!payload.email || !payload.title || !payload.message) {
        return 'All fields are required.'
    }

    if (!payload.recaptchaToken) {
        return 'Captcha verification is required.'
    }

    if (!EMAIL_REGEX.test(payload.email)) {
        return 'Please provide a valid email address.'
    }

    if (payload.title.length > 120) {
        return 'Title is too long (max 120 characters).'
    }

    if (payload.message.length > 5000) {
        return 'Message is too long (max 5000 characters).'
    }

    return null
}

function parsePayload(body: unknown): ContactPayload | null {
    if (!body || typeof body !== 'object') {
        return null
    }

    const { email, title, message, recaptchaToken } = body as Record<string, unknown>
    if (
        typeof email !== 'string' ||
        typeof title !== 'string' ||
        typeof message !== 'string' ||
        typeof recaptchaToken !== 'string'
    ) {
        return null
    }

    return {
        email: email.trim(),
        title: title.trim(),
        message: message.trim(),
        recaptchaToken: recaptchaToken.trim(),
    }
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
        return NextResponse.json(
            { error: 'Too many requests. Please try again in a few minutes.' },
            {
                status: 429,
                headers: rateLimitResult.retryAfterSeconds
                    ? { 'Retry-After': String(rateLimitResult.retryAfterSeconds) }
                    : undefined,
            }
        )
    }

    const body = await request.json().catch(() => null)
    const payload = parsePayload(body)
    if (!payload) {
        return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 })
    }

    const validationError = validatePayload(payload)
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 })
    }

    const recaptchaValidation = await verifyRecaptcha(payload.recaptchaToken)
    if (!recaptchaValidation.ok) {
        return NextResponse.json({ error: recaptchaValidation.error }, { status: 400 })
    }

    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const toEmail = process.env.CONTACT_TO_EMAIL
    const fromEmail = process.env.CONTACT_FROM_EMAIL

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !toEmail || !fromEmail) {
        return NextResponse.json(
            { error: 'Email service is not configured on the server.' },
            { status: 500 }
        )
    }

    const port = Number(smtpPort)
    if (!Number.isInteger(port) || port <= 0) {
        return NextResponse.json(
            { error: 'Server email configuration is invalid (SMTP_PORT).' },
            { status: 500 }
        )
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
        console.error('Contact email send failed:', error)
        return NextResponse.json(
            { error: 'Could not send your message right now. Please try again.' },
            { status: 502 }
        )
    }

    return NextResponse.json({ success: true })
}
