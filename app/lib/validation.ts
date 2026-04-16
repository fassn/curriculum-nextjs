type ValidationResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: string }

type PostPayload = {
    content: string
}

export type ContactPayload = {
    email: string
    title: string
    message: string
    recaptchaToken: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_POST_CONTENT_LENGTH = 100000
const MAX_CONTACT_TITLE_LENGTH = 120
const MAX_CONTACT_MESSAGE_LENGTH = 5000

export function parsePostPayload(body: unknown): ValidationResult<PostPayload> {
    if (!body || typeof body !== 'object' || typeof (body as Record<string, unknown>).content !== 'string') {
        return { ok: false, error: 'Invalid request payload.' }
    }

    const content = (body as Record<string, string>).content.trim()
    if (!content) {
        return { ok: false, error: 'Post content is required.' }
    }

    if (content.length > MAX_POST_CONTENT_LENGTH) {
        return { ok: false, error: 'Post content is too long.' }
    }

    return {
        ok: true,
        data: { content },
    }
}

export function parseContactPayload(body: unknown): ValidationResult<ContactPayload> {
    if (!body || typeof body !== 'object') {
        return { ok: false, error: 'Invalid request payload.' }
    }

    const { email, title, message, recaptchaToken } = body as Record<string, unknown>
    if (
        typeof email !== 'string' ||
        typeof title !== 'string' ||
        typeof message !== 'string' ||
        typeof recaptchaToken !== 'string'
    ) {
        return { ok: false, error: 'Invalid request payload.' }
    }

    const normalized = {
        email: email.trim(),
        title: title.trim(),
        message: message.trim(),
        recaptchaToken: recaptchaToken.trim(),
    }

    if (!normalized.email || !normalized.title || !normalized.message) {
        return { ok: false, error: 'All fields are required.' }
    }

    if (!normalized.recaptchaToken) {
        return { ok: false, error: 'Captcha verification is required.' }
    }

    if (!EMAIL_REGEX.test(normalized.email)) {
        return { ok: false, error: 'Please provide a valid email address.' }
    }

    if (normalized.title.length > MAX_CONTACT_TITLE_LENGTH) {
        return { ok: false, error: 'Title is too long (max 120 characters).' }
    }

    if (normalized.message.length > MAX_CONTACT_MESSAGE_LENGTH) {
        return { ok: false, error: 'Message is too long (max 5000 characters).' }
    }

    return {
        ok: true,
        data: normalized,
    }
}
