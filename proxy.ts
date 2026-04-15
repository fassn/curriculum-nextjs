import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_SESSION_COOKIE_NAME, verifyAdminSessionToken } from '@/app/lib/admin-session-token'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value
    const hasValidSession = sessionToken ? Boolean(await verifyAdminSessionToken(sessionToken)) : false

    if (pathname.startsWith('/signup')) {
        const redirectStatus = request.method === 'GET' || request.method === 'HEAD' ? 307 : 303
        return NextResponse.redirect(new URL('/', request.url), redirectStatus)
    }

    if (pathname === '/signin' && hasValidSession) {
        return NextResponse.redirect(new URL('/admin', request.url), 307)
    }

    if (pathname.startsWith('/admin') && !hasValidSession) {
        return NextResponse.redirect(new URL('/signin', request.url), 307)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/signup/:path*', '/admin/:path*', '/signin'],
}
