import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'
import { jsonError } from '@/app/lib/api-response'
import { getAuthenticatedAdmin, hasValidAdminCsrfToken } from '@/app/lib/admin-auth'
import { formatFrenchDate } from '@/app/lib/date-format'
import { logError } from '@/app/lib/logger'
import { parsePostPayload } from '@/app/lib/validation'

export const runtime = 'nodejs'

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params
    const post = await prisma.post.findUnique({
        where: { id: postId },
    })

    if (!post) {
        return jsonError('Post not found.', 404)
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
        return jsonError('Unauthorized.', 401)
    }

    const isValidCsrfToken = await hasValidAdminCsrfToken(request)
    if (!isValidCsrfToken) {
        return jsonError('Invalid CSRF token.', 403)
    }

    const { postId } = await params
    const body = await request.json().catch(() => null)
    const parsedPayload = parsePostPayload(body)
    if (!parsedPayload.ok) {
        return jsonError(parsedPayload.error, 400)
    }

    try {
        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { content: parsedPayload.data.content },
        })

        return NextResponse.json({ id: updatedPost.id })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return jsonError('Post not found.', 404)
        }

        logError('posts.update_failed', error, { postId, adminId: admin.id })
        return jsonError('Could not update post.', 500)
    }
}
