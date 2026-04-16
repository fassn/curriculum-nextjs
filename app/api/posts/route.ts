import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'
import { getAuthenticatedAdmin, hasValidAdminCsrfToken } from '@/app/lib/admin-auth'

export const runtime = 'nodejs'
const DEFAULT_POSTS_LIMIT = 20
const MAX_POSTS_LIMIT = 100

function formatFrenchDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date)
}

function isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')?.trim() ?? null
    const requestedLimit = searchParams.get('limit')

    const parsedLimit = requestedLimit ? Number(requestedLimit) : DEFAULT_POSTS_LIMIT
    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
        return NextResponse.json({ error: 'Query param "limit" must be a positive integer.' }, { status: 400 })
    }

    if (cursor && !isUuid(cursor)) {
        return NextResponse.json({ error: 'Query param "cursor" must be a valid post id.' }, { status: 400 })
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
            return NextResponse.json({ error: 'Cursor not found.' }, { status: 400 })
        }
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
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const isValidCsrfToken = await hasValidAdminCsrfToken(request)
    if (!isValidCsrfToken) {
        return NextResponse.json({ error: 'Invalid CSRF token.' }, { status: 403 })
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body !== 'object' || typeof (body as Record<string, unknown>).content !== 'string') {
        return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 })
    }

    const content = (body as Record<string, string>).content.trim()
    if (!content) {
        return NextResponse.json({ error: 'Post content is required.' }, { status: 400 })
    }

    if (content.length > 100000) {
        return NextResponse.json({ error: 'Post content is too long.' }, { status: 400 })
    }

    try {
        const createdPost = await prisma.post.create({
            data: {
                content,
            },
        })

        return NextResponse.json({
            id: createdPost.id,
        })
    } catch (error) {
        console.error('Post creation failed:', error)
        return NextResponse.json({ error: 'Could not create post.' }, { status: 500 })
    }
}
