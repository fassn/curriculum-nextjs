import { Post } from "@/app/types/post"
import { getPostById } from '@/app/lib/frontend-api-client'

export default async function getPost(postId: string): Promise<Post> {
    const response = await getPostById(postId)
    if (!response.ok) {
        return { content: '', date: '' }
    }

    return response.data
}
