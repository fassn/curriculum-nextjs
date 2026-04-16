type PaginationResult =
    | { ok: true; data: { cursor: string | null; limit: number } }
    | { ok: false; error: string }

export const DEFAULT_POSTS_LIMIT = 20
export const MAX_POSTS_LIMIT = 100

function isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function parsePostsPaginationParams(requestUrl: string): PaginationResult {
    const { searchParams } = new URL(requestUrl)
    const cursor = searchParams.get('cursor')?.trim() ?? null
    const requestedLimit = searchParams.get('limit')

    const parsedLimit = requestedLimit ? Number(requestedLimit) : DEFAULT_POSTS_LIMIT
    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
        return { ok: false, error: 'Query param "limit" must be a positive integer.' }
    }

    if (cursor && !isUuid(cursor)) {
        return { ok: false, error: 'Query param "cursor" must be a valid post id.' }
    }

    return {
        ok: true,
        data: {
            cursor,
            limit: Math.min(parsedLimit, MAX_POSTS_LIMIT),
        },
    }
}
