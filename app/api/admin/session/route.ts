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
import { getAuthenticatedAdmin } from '@/app/lib/admin-auth'
import { logError } from '@/app/lib/logger'
import { getClientIp } from '@/app/lib/request-ip'
import { createRateLimiter } from '@/app/lib/rate-limit'

export const runtime = 'nodejs'

type SessionRequestBody = {
    email?: string
    password?: string
}

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
    const body = await request.json().catch(() => null) as SessionRequestBody | null
    const email = body?.email?.trim().toLowerCase()
    const password = body?.password

    const clientIp = getClientIp(request)
    const rateLimitResult = await signinRateLimiter.check(`${clientIp}|${email ?? 'unknown'}`)
    if (rateLimitResult.limited) {
        return NextResponse.json(
            { error: 'Too many sign-in attempts. Please try again later.' },
            {
                status: 429,
                headers: rateLimitResult.retryAfterSeconds
                    ? { 'Retry-After': String(rateLimitResult.retryAfterSeconds) }
                    : undefined,
            }
        )
    }

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const admin = await prisma.adminUser.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            passwordHash: true,
        },
    })

    if (!admin) {
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)
    if (!isValidPassword) {
        return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }

    let token: string
    try {
        token = await createAdminSessionToken({
            userId: admin.id,
            email: admin.email,
        })
    } catch (error) {
        logError('admin.session_token_create_failed', error, { adminId: admin.id })
        return NextResponse.json({ error: 'Server auth is not configured.' }, { status: 500 })
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
