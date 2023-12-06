'use client'

import { useEffect, useState } from "react"
import getPosts from "../firebase/firestore/get-posts"

export default function Blog() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        getPosts().then(posts => {
            if (posts) setPosts(posts)
        })
    })

    if (posts.length === 0) return <div>Loading...</div>
    return (
        <>
            <div>coucou</div>
        </>
    )
}