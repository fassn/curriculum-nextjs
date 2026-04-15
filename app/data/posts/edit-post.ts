import { Post } from "@/app/types/post"
import { getAdminCsrfTokenFromCookie } from '@/app/lib/get-csrf-token'

type EditPostResponse = {
    id?: string,
    error?: string
}

export default async function editPost(id: string, post: Post): Promise<EditPostResponse> {
    const csrfToken = getAdminCsrfTokenFromCookie()
    if (!csrfToken) {
        return { error: 'Your admin session is invalid. Please sign in again.' }
    }

    const response = await fetch('/api/posts/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
            content: post.content,
        }),
    })

    const body = await response.json().catch(() => null)
    if (!response.ok) {
        return { error: body?.error ?? 'Post could not be updated.' }
    }

    if (typeof body?.id !== 'string') {
        return { error: 'Post could not be updated.' }
    }

    return { id: body.id }
}
