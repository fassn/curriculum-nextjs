import { describe, expect, it } from 'vitest'
import { DEFAULT_POSTS_LIMIT, MAX_POSTS_LIMIT, parsePostsPaginationParams } from './posts-pagination'

describe('parsePostsPaginationParams', () => {
    it('use defaults when params missing', () => {
        const result = parsePostsPaginationParams('https://example.com/api/posts')
        expect(result).toEqual({
            ok: true,
            data: {
                cursor: null,
                limit: DEFAULT_POSTS_LIMIT,
            },
        })
    })

    it('cap limit to max', () => {
        const result = parsePostsPaginationParams(`https://example.com/api/posts?limit=${MAX_POSTS_LIMIT + 500}`)
        expect(result).toEqual({
            ok: true,
            data: {
                cursor: null,
                limit: MAX_POSTS_LIMIT,
            },
        })
    })

    it('reject invalid limit', () => {
        const result = parsePostsPaginationParams('https://example.com/api/posts?limit=0')
        expect(result).toEqual({
            ok: false,
            error: 'Query param "limit" must be a positive integer.',
        })
    })

    it('reject invalid cursor', () => {
        const result = parsePostsPaginationParams('https://example.com/api/posts?cursor=not-a-uuid')
        expect(result).toEqual({
            ok: false,
            error: 'Query param "cursor" must be a valid post id.',
        })
    })
})
