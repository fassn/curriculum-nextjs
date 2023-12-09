'use client'

import { useEffect, useState } from "react"
import getPosts from "../firebase/firestore/get-posts"
import { Post } from "../types/post"

export default function Blog() {
    const [posts, setPosts] = useState<[key: string, Post][]>([])

    useEffect(() => {
        getPosts().then(posts => setPosts(posts))
    }, [])

    if (posts.length === 0) return <div>No posts yet.</div>
    return (
        <div className="flex flex-col max-w-6xl py-4 px-6 lg:px-8 sm:mx-4 xl:mx-auto">
            <ul>
                { posts.length > 0 && posts.map(post => (
                    <li
                        className="w-full p-4 mb-10 dark:bg-gray-700 shadow-sm shadow-gray-400 dark:shadow-none rounded"
                        key={post[0]}>
                            <div className="w-fit h-8 mb-6">
                                { post[1].date }
                                <hr className="mt-2"></hr>
                            </div>
                            <div dangerouslySetInnerHTML={{ __html: post[1].content }}>
                            </div>
                    </li>
                )) }
            </ul>
        </div>
    )
}