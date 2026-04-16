import { timingSafeEqual } from 'node:crypto'

export function areCsrfTokensEqual(headerToken: string, cookieToken: string): boolean {
    const encoder = new TextEncoder()
    const headerBuffer = encoder.encode(headerToken)
    const cookieBuffer = encoder.encode(cookieToken)

    if (headerBuffer.length !== cookieBuffer.length) {
        return false
    }

    return timingSafeEqual(headerBuffer, cookieBuffer)
}
