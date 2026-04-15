type RateLimitEntry = {
    count: number
    resetAt: number
}

export function createRateLimiter(windowMs: number, maxRequests: number) {
    const store = new Map<string, RateLimitEntry>()

    return {
        isRateLimited(key: string): boolean {
            const now = Date.now()

            for (const [entryKey, entry] of store.entries()) {
                if (entry.resetAt <= now) {
                    store.delete(entryKey)
                }
            }

            const current = store.get(key)
            if (!current || current.resetAt <= now) {
                store.set(key, { count: 1, resetAt: now + windowMs })
                return false
            }

            if (current.count >= maxRequests) {
                return true
            }

            store.set(key, { ...current, count: current.count + 1 })
            return false
        },
    }
}
