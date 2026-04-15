import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

type ContactPayload = {
    email: string
    title: string
    message: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitizeHeaderValue(value: string): string {
    return value.replace(/[\r\n]+/g, ' ').trim()
}

function validatePayload(payload: ContactPayload): string | null {
    if (!payload.email || !payload.title || !payload.message) {
        return 'All fields are required.'
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

    const { email, title, message } = body as Record<string, unknown>
    if (typeof email !== 'string' || typeof title !== 'string' || typeof message !== 'string') {
        return null
    }

    return {
        email: email.trim(),
        title: title.trim(),
        message: message.trim(),
    }
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null)
    const payload = parsePayload(body)
    if (!payload) {
        return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 })
    }

    const validationError = validatePayload(payload)
    if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 })
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
