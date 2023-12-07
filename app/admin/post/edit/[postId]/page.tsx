'use client'

import TinyMCE from "@/app/components/tinymce"
import firebaseApp from "@/app/firebase/config"
import { Post } from "@/app/types/post"
import { child, get, getDatabase, ref } from "firebase/database"
import { useEffect, useState } from "react"

export default function EditPost({ params }: { params: { postId: string }}) {
    const db = getDatabase(firebaseApp)
    const [post, setPost] = useState<Post>(null)

    useEffect(() => {
        get(child(ref(db), '/posts/' + params.postId)).then(snapshot => {
            if (snapshot.exists()) {
                setPost(snapshot.val())
            }
        })
    }, [])

    if (!post) return <div>Loading...</div>
    return (
        <div>
            <TinyMCE postId={params.postId} post={post}></TinyMCE>
        </div>
    )
}