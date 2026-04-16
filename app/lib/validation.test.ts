import { describe, expect, it } from 'vitest'
import { parseAdminSigninPayload, parseContactPayload, parsePostPayload } from './validation'

describe('parsePostPayload', () => {
    it('accept valid post content', () => {
        const result = parsePostPayload({ content: ' hello ' })
        expect(result).toEqual({
            ok: true,
            data: { content: 'hello' },
        })
    })

    it('reject empty content', () => {
        const result = parsePostPayload({ content: '   ' })
        expect(result).toEqual({
            ok: false,
            error: 'Post content is required.',
        })
    })
})

describe('parseContactPayload', () => {
    it('accept valid contact payload', () => {
        const result = parseContactPayload({
            email: ' test@example.com ',
            title: ' Hello ',
            message: ' Message body ',
            recaptchaToken: ' token ',
        })
        expect(result).toEqual({
            ok: true,
            data: {
                email: 'test@example.com',
                title: 'Hello',
                message: 'Message body',
                recaptchaToken: 'token',
            },
        })
    })

    it('reject invalid email', () => {
        const result = parseContactPayload({
            email: 'invalid-email',
            title: 'Hello',
            message: 'Message',
            recaptchaToken: 'token',
        })
        expect(result).toEqual({
            ok: false,
            error: 'Please provide a valid email address.',
        })
    })
})

describe('parseAdminSigninPayload', () => {
    it('accept valid signin payload', () => {
        const result = parseAdminSigninPayload({
            email: ' ADMIN@EXAMPLE.COM ',
            password: 'secret',
        })
        expect(result).toEqual({
            ok: true,
            data: {
                email: 'admin@example.com',
                password: 'secret',
            },
        })
    })

    it('reject missing credentials', () => {
        const result = parseAdminSigninPayload({ email: 'admin@example.com', password: '' })
        expect(result).toEqual({
            ok: false,
            error: 'Email and password are required.',
        })
    })
})
