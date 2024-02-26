'use client'

import TinyMCE from "@/app/components/TinyMCE"
import getPost from "@/app/firebase/firestore/get-post"
import { Post } from "@/app/types/post"
import { useEffect, useState } from "react"

export default function EditPost({ params }: { params: { postId: string }}) {
    const [post, setPost] = useState<Post>({ content: '', date: '' })

    useEffect(() => {
        getPost(params.postId).then(post => setPost(post))
    }, [])

    if (!post.date) return <div>Loading...</div>
    return (
        <div>
            <TinyMCE postId={params.postId} post={post}></TinyMCE>
        </div>
    )
}