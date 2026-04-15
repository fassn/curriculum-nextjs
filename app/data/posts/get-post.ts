import { Post } from "@/app/types/post"

export default async function getPost(postId: string): Promise<Post> {
    const response = await fetch('/api/posts/' + postId, {
        method: 'GET',
        cache: 'no-store',
    })

    const body = await response.json().catch(() => null)
    if (!response.ok || !body?.post) {
        return { content: '', date: '' }
    }

    return body.post as Post
}
