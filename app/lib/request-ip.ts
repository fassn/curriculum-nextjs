import { isIP } from 'node:net'

function normalizeIp(value: string): string | null {
    const trimmed = value.trim().replace(/^"|"$/g, '')
    if (!trimmed || trimmed.toLowerCase() === 'unknown') {
        return null
    }

    if (isIP(trimmed)) {
        return trimmed
    }

    if (trimmed.startsWith('[') && trimmed.includes(']:')) {
        const ipv6 = trimmed.slice(1, trimmed.indexOf(']:'))
        return isIP(ipv6) ? ipv6 : null
    }

    const parts = trimmed.split(':')
    if (parts.length === 2 && isIP(parts[0])) {
        return parts[0]
    }

    if (trimmed.startsWith('::ffff:')) {
        const mapped = trimmed.slice('::ffff:'.length)
        return isIP(mapped) ? mapped : null
    }

    return null
}

export function getClientIp(request: Request): string {
    const xRealIp = request.headers.get('x-real-ip')
    if (xRealIp) {
        const ip = normalizeIp(xRealIp)
        if (ip) {
            return ip
        }
    }

    const xForwardedFor = request.headers.get('x-forwarded-for')
    if (xForwardedFor) {
        for (const value of xForwardedFor.split(',')) {
            const ip = normalizeIp(value)
            if (ip) {
                return ip
            }
        }
    }

    return 'unknown'
}
