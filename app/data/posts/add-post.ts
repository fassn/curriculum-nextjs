import { getAdminCsrfTokenFromCookie } from '@/app/lib/get-csrf-token'

export type AddPostResponse = {
    id?: string,
    error?: string
}

export default async function addPost(content: string): Promise<AddPostResponse> {
    const csrfToken = getAdminCsrfTokenFromCookie()
    if (!csrfToken) {
        return { error: 'Your admin session is invalid. Please sign in again.' }
    }

    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ content }),
    })

    const body = await response.json().catch(() => null)
    if (!response.ok) {
        return { error: body?.error ?? 'Post could not be created.' }
    }

    if (typeof body?.id !== 'string') {
        return { error: 'Post could not be created.' }
    }

    return { id: body.id }
}
