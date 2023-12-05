'use client'

import { useEffect, useState } from "react"
import { useAuthContext } from "../context/auth-context"
import { useRouter } from "next/navigation"
import TinyMCE from "../components/tinymce"
import getPosts from "../firebase/firestore/get-posts"

export default function Admin() {
    const { user } = useAuthContext()
    const router = useRouter()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (user == null) router.push("/signin")

        getPosts().then(posts => setPosts(posts))
    }, [user, router])


    if (!user) {
        return (<h1>Only logged in users can view this page</h1>)
    }

    // async function getData() {
    //     const posts = await getPosts()
    //     return posts
    // }

    console.log([posts]);
    // console.table(posts.forEach(post => console.log(posts)));
    // console.log(posts.map(post => console.log(post)));
    return (
        <>
            <div>
                {/* { posts ? <div>{posts}</div> : <div>gay</div> } */}
            </div>
            <TinyMCE></TinyMCE>
        </>
    )
}