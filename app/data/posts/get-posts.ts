import { Post } from "@/app/types/post"

export default async function getPosts(): Promise<[key: string, Post][]> {
    const response = await fetch('/api/posts', {
        method: 'GET',
        cache: 'no-store',
    })

    const body = await response.json().catch(() => null)
    if (!response.ok || !Array.isArray(body?.posts)) {
        return []
    }

    return body.posts.map((post: { id: string; content: string; date: string }) => {
        return [post.id, { content: post.content, date: post.date }]
    })
}
