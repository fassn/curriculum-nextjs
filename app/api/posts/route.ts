import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'
import { jsonError } from '@/app/lib/api-response'
import { getAuthenticatedAdmin, hasValidAdminCsrfToken } from '@/app/lib/admin-auth'
import { formatFrenchDate } from '@/app/lib/date-format'
import { logError } from '@/app/lib/logger'
import { parsePostPayload } from '@/app/lib/validation'

export const runtime = 'nodejs'
const DEFAULT_POSTS_LIMIT = 20
const MAX_POSTS_LIMIT = 100

function isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')?.trim() ?? null
    const requestedLimit = searchParams.get('limit')

    const parsedLimit = requestedLimit ? Number(requestedLimit) : DEFAULT_POSTS_LIMIT
    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
        return jsonError('Query param "limit" must be a positive integer.', 400)
    }

    if (cursor && !isUuid(cursor)) {
        return jsonError('Query param "cursor" must be a valid post id.', 400)
    }

    const limit = Math.min(parsedLimit, MAX_POSTS_LIMIT)

    let posts
    try {
        posts = await prisma.post.findMany({
            take: limit + 1,
            ...(cursor
                ? {
                      cursor: { id: cursor },
                      skip: 1,
                  }
                : {}),
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return jsonError('Cursor not found.', 400)
        }
        logError('posts.list_failed', error, { cursor, limit })
        throw error
    }

    const hasMore = posts.length > limit
    const pagePosts = hasMore ? posts.slice(0, limit) : posts
    const nextCursor = hasMore ? pagePosts[pagePosts.length - 1]?.id ?? null : null

    return NextResponse.json({
        posts: pagePosts.map((post) => ({
            id: post.id,
            content: post.content,
            date: formatFrenchDate(post.createdAt),
        })),
        pageInfo: {
            limit,
            hasMore,
            nextCursor,
        },
    })
}

export async function POST(request: Request) {
    const admin = await getAuthenticatedAdmin()
    if (!admin) {
        return jsonError('Unauthorized.', 401)
    }

    const isValidCsrfToken = await hasValidAdminCsrfToken(request)
    if (!isValidCsrfToken) {
        return jsonError('Invalid CSRF token.', 403)
    }

    const body = await request.json().catch(() => null)
    const parsedPayload = parsePostPayload(body)
    if (!parsedPayload.ok) {
        return jsonError(parsedPayload.error, 400)
    }

    try {
        const createdPost = await prisma.post.create({
            data: {
                content: parsedPayload.data.content,
            },
        })

        return NextResponse.json({
            id: createdPost.id,
        })
    } catch (error) {
        logError('posts.create_failed', error, { adminId: admin.id })
        return jsonError('Could not create post.', 500)
    }
}
