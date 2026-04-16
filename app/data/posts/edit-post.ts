import { Post } from "@/app/types/post"
import { getAdminCsrfTokenFromCookie } from '@/app/lib/get-csrf-token'
import { updatePost } from '@/app/lib/frontend-api-client'

type EditPostResponse = {
    id?: string,
    error?: string
}

export default async function editPost(id: string, post: Post): Promise<EditPostResponse> {
    const csrfToken = getAdminCsrfTokenFromCookie()
    if (!csrfToken) {
        return { error: 'Your admin session is invalid. Please sign in again.' }
    }

    const response = await updatePost({ postId: id, content: post.content, csrfToken })
    if (!response.ok) {
        return { error: response.error }
    }

    return { id: response.data.id }
}
