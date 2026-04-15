import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const redirectStatus = request.method === 'GET' || request.method === 'HEAD' ? 307 : 303
    return NextResponse.redirect(new URL('/', request.url), redirectStatus)
}

export const config = {
    matcher: '/signup/:path*', // redirecting for the time being, no need to signup new users
}
