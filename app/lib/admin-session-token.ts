import { SignJWT, jwtVerify } from 'jose'

export const ADMIN_SESSION_COOKIE_NAME = 'admin_session'
export const ADMIN_CSRF_COOKIE_NAME = 'admin_csrf'

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7

type SessionPayload = {
    sub: string
    email: string
}

export type AdminSession = {
    userId: string
    email: string
}

function getSessionSecret(): Uint8Array {
    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret) {
        throw new Error('Missing ADMIN_SESSION_SECRET environment variable.')
    }
    return new TextEncoder().encode(secret)
}

export async function createAdminSessionToken(session: AdminSession): Promise<string> {
    const secret = getSessionSecret()
    return new SignJWT({
        email: session.email,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setSubject(session.userId)
        .setIssuedAt()
        .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
        .sign(secret)
}

export async function verifyAdminSessionToken(token: string): Promise<AdminSession | null> {
    try {
        const secret = getSessionSecret()
        const { payload } = await jwtVerify<SessionPayload>(token, secret)
        if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
            return null
        }

        return {
            userId: payload.sub,
            email: payload.email,
        }
    } catch {
        return null
    }
}

export function getAdminSessionCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/',
        maxAge: SESSION_DURATION_SECONDS,
    }
}

export function getAdminCsrfCookieOptions() {
    return {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        path: '/',
        maxAge: SESSION_DURATION_SECONDS,
    }
}
