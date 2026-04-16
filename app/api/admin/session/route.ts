import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/app/lib/prisma'
import {
    ADMIN_CSRF_COOKIE_NAME,
    ADMIN_SESSION_COOKIE_NAME,
    createAdminSessionToken,
    getAdminCsrfCookieOptions,
    getAdminSessionCookieOptions,
} from '@/app/lib/admin-session-token'
import { jsonError } from '@/app/lib/api-response'
import { getAuthenticatedAdmin } from '@/app/lib/admin-auth'
import { logError } from '@/app/lib/logger'
import { getClientIp } from '@/app/lib/request-ip'
import { createRateLimiter } from '@/app/lib/rate-limit'
import { parseAdminSigninPayload } from '@/app/lib/validation'

export const runtime = 'nodejs'

const SIGNIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const SIGNIN_RATE_LIMIT_MAX_REQUESTS = 10
const signinRateLimiter = createRateLimiter({
    prefix: 'admin-signin',
    windowMs: SIGNIN_RATE_LIMIT_WINDOW_MS,
    maxRequests: SIGNIN_RATE_LIMIT_MAX_REQUESTS,
})

export async function GET() {
    const admin = await getAuthenticatedAdmin()
    if (!admin) {
        return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({
        authenticated: true,
        admin: {
            email: admin.email,
        },
    })
}

export async function POST(request: Request) {
    const body = await request.json().catch(() => null)
    const parsedPayload = parseAdminSigninPayload(body)
    const email = parsedPayload.ok ? parsedPayload.data.email : undefined

    const clientIp = getClientIp(request)
    const rateLimitResult = await signinRateLimiter.check(`${clientIp}|${email ?? 'unknown'}`)
    if (rateLimitResult.limited) {
        return jsonError('Too many sign-in attempts. Please try again later.', 429, {
            headers: rateLimitResult.retryAfterSeconds
                ? { 'Retry-After': String(rateLimitResult.retryAfterSeconds) }
                : undefined,
        })
    }

    if (!parsedPayload.ok) {
        return jsonError(parsedPayload.error, 400)
    }
    const { password } = parsedPayload.data

    const admin = await prisma.adminUser.findUnique({
        where: { email: parsedPayload.data.email },
        select: {
            id: true,
            email: true,
            passwordHash: true,
        },
    })

    if (!admin) {
        return jsonError('Invalid credentials.', 401)
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)
    if (!isValidPassword) {
        return jsonError('Invalid credentials.', 401)
    }

    let token: string
    try {
        token = await createAdminSessionToken({
            userId: admin.id,
            email: admin.email,
        })
    } catch (error) {
        logError('admin.session_token_create_failed', error, { adminId: admin.id })
        return jsonError('Server auth is not configured.', 500)
    }

    const response = NextResponse.json({
        authenticated: true,
        admin: {
            email: admin.email,
        },
    })

    const csrfToken = crypto.randomUUID().replaceAll('-', '')
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, getAdminSessionCookieOptions())
    response.cookies.set(ADMIN_CSRF_COOKIE_NAME, csrfToken, getAdminCsrfCookieOptions())
    return response
}

export async function DELETE() {
    const response = NextResponse.json({ authenticated: false })
    response.cookies.set(ADMIN_SESSION_COOKIE_NAME, '', {
        ...getAdminSessionCookieOptions(),
        maxAge: 0,
    })
    response.cookies.set(ADMIN_CSRF_COOKIE_NAME, '', {
        ...getAdminCsrfCookieOptions(),
        maxAge: 0,
    })
    return response
}
