const ADMIN_CSRF_COOKIE_NAME = 'admin_csrf'

export function getAdminCsrfTokenFromCookie(): string | null {
    if (typeof document === 'undefined') {
        return null
    }

    const cookiePart = document.cookie
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${ADMIN_CSRF_COOKIE_NAME}=`))

    if (!cookiePart) {
        return null
    }

    const token = cookiePart.slice(`${ADMIN_CSRF_COOKIE_NAME}=`.length)
    return token ? decodeURIComponent(token) : null
}
