import { cookies } from 'next/headers'
import { timingSafeEqual } from 'node:crypto'
import { redirect } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'
import {
    ADMIN_CSRF_COOKIE_NAME,
    ADMIN_SESSION_COOKIE_NAME,
    verifyAdminSessionToken,
} from '@/app/lib/admin-session-token'

export type AuthenticatedAdmin = {
    id: string
    email: string
}

export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin | null> {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value
    if (!token) {
        return null
    }

    const session = await verifyAdminSessionToken(token)
    if (!session) {
        return null
    }

    const adminUser = await prisma.adminUser.findUnique({
        where: { id: session.userId },
        select: { id: true, email: true },
    })

    if (!adminUser || adminUser.email.toLowerCase() !== session.email.toLowerCase()) {
        return null
    }

    return adminUser
}

export async function requireAuthenticatedAdmin(): Promise<AuthenticatedAdmin> {
    const admin = await getAuthenticatedAdmin()
    if (!admin) {
        redirect('/signin')
    }
    return admin
}

export async function hasValidAdminCsrfToken(request: Request): Promise<boolean> {
    const headerToken = request.headers.get('x-csrf-token')?.trim()
    if (!headerToken) {
        return false
    }

    const cookieStore = await cookies()
    const cookieToken = cookieStore.get(ADMIN_CSRF_COOKIE_NAME)?.value
    if (!cookieToken) {
        return false
    }

    const encoder = new TextEncoder()
    const headerBuffer = encoder.encode(headerToken)
    const cookieBuffer = encoder.encode(cookieToken)

    if (headerBuffer.length !== cookieBuffer.length) {
        return false
    }

    return timingSafeEqual(headerBuffer, cookieBuffer)
}
