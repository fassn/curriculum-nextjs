'use client'

import TinyMCE from "@/app/components/tinymce"
import getPost from "@/app/firebase/firestore/get-post"
import { Post } from "@/app/types/post"
import { useEffect, useState } from "react"

export default function EditPost({ params }: { params: { postId: string }}) {
    const [post, setPost] = useState<Post>(null)

    useEffect(() => {
        getPost(params.postId).then(post => setPost(post))
    }, [])

    if (!post) return <div>Loading...</div>
    return (
        <div>
            <TinyMCE postId={params.postId} post={post}></TinyMCE>
        </div>
    )
}