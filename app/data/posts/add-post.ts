import { getAdminCsrfTokenFromCookie } from '@/app/lib/get-csrf-token'
import { createPost } from '@/app/lib/frontend-api-client'

export type AddPostResponse = {
    id?: string,
    error?: string
}

export default async function addPost(content: string): Promise<AddPostResponse> {
    const csrfToken = getAdminCsrfTokenFromCookie()
    if (!csrfToken) {
        return { error: 'Your admin session is invalid. Please sign in again.' }
    }

    const response = await createPost({ content, csrfToken })
    if (!response.ok) {
        return { error: response.error }
    }

    return { id: response.data.id }
}
