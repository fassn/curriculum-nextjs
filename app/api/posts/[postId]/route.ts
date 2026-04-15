import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { getAuthenticatedAdmin, hasValidAdminCsrfToken } from '@/app/lib/admin-auth'

export const runtime = 'nodejs'

function formatFrenchDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date)
}

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params
    const post = await prisma.post.findUnique({
        where: { id: postId },
    })

    if (!post) {
        return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
    }

    return NextResponse.json({
        post: {
            content: post.content,
            date: formatFrenchDate(post.createdAt),
        },
    })
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const admin = await getAuthenticatedAdmin()
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
    }

    const isValidCsrfToken = await hasValidAdminCsrfToken(request)
    if (!isValidCsrfToken) {
        return NextResponse.json({ error: 'Invalid CSRF token.' }, { status: 403 })
    }

    const { postId } = await params
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
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { content },
        })

        return NextResponse.json({ id: updatedPost.id })
    } catch (error) {
        console.error('Post update failed:', error)
        return NextResponse.json({ error: 'Could not update post.' }, { status: 500 })
    }
}
