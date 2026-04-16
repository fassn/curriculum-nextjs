import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'
import { jsonError } from '@/app/lib/api-response'
import { getAuthenticatedAdmin, hasValidAdminCsrfToken } from '@/app/lib/admin-auth'
import { formatFrenchDate } from '@/app/lib/date-format'
import { logError } from '@/app/lib/logger'
import { parsePostsPaginationParams } from '@/app/lib/posts-pagination'
import { parsePostPayload } from '@/app/lib/validation'

export const runtime = 'nodejs'

export async function GET(request: Request) {
    const parsedPagination = parsePostsPaginationParams(request.url)
    if (!parsedPagination.ok) {
        return jsonError(parsedPagination.error, 400)
    }
    const { cursor, limit } = parsedPagination.data

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
