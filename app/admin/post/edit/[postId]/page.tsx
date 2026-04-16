'use client'

import PostEditor from "@/app/components/PostEditor"
import getPost from "@/app/data/posts/get-post"
import { Post } from "@/app/types/post"
import { use, useEffect, useState } from "react"

export default function EditPost({ params }: { params: Promise<{ postId: string }> }) {
    const { postId } = use(params)
    const [post, setPost] = useState<Post>({ content: '', date: '' })

    useEffect(() => {
        getPost(postId).then(post => setPost(post))
    }, [postId])

    if (!post.date) return <div>Loading...</div>
    return (
        <div>
            <PostEditor postId={postId} post={post}></PostEditor>
        </div>
    )
}
