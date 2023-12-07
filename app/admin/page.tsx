'use client'

import { useEffect, useState } from "react"
import { useAuthContext } from "../context/auth-context"
import { useRouter } from "next/navigation"
import getPosts from "../firebase/firestore/get-posts"
import Link from "next/link"

export default function Admin() {
    const { user } = useAuthContext()
    const router = useRouter()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if (user == null) router.push("/signin")

        getPosts().then(posts => {
            setPosts(Object.entries(posts))
        })
    }, [user, router])


    if (!user) {
        return (<h1>Only logged in users can view this page</h1>)
    }

    return (
        <div className="flex flex-col max-w-6xl py-4 px-6 lg:px-8 sm:mx-4 xl:mx-auto">
            <div className="flex flex-col items-center mt-4">
                <button
                    className='w-1/2 items-center bg-gray-800 dark:bg-gray-200  border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-700 uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150'>
                    <Link
                        className="block px-4 py-2"
                        href='/admin/post/new'>
                        New Post
                    </Link>
                </button>
                <hr className="w-full mt-4 mb-8"></hr>
            </div>
            { posts.length === 0 && <div>No posts yet.</div> }
            <ul>
                { posts.length > 0 && posts.map(post => (
                    <li
                        className="flex justify-between w-full p-4 my-2 dark:bg-gray-700 rounded"
                        key={post[0]}>
                        {post[1].content}
                        <Link href={'/admin/post/edit/' + post[0]}>
                            <svg
                                width="25px"
                                height="25px"
                                fill="#ffffff"
                                viewBox="0 0 24 24"xmlns="http://www.w3.org/2000/svg"><path d="M18.111,2.293,9.384,11.021a.977.977,0,0,0-.241.39L8.052,14.684A1,1,0,0,0,9,16a.987.987,0,0,0,.316-.052l3.273-1.091a.977.977,0,0,0,.39-.241l8.728-8.727a1,1,0,0,0,0-1.414L19.525,2.293A1,1,0,0,0,18.111,2.293ZM11.732,13.035l-1.151.384.384-1.151L16.637,6.6l.767.767Zm7.854-7.853-.768.767-.767-.767.767-.768ZM3,5h8a1,1,0,0,1,0,2H4V20H17V13a1,1,0,0,1,2,0v8a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V6A1,1,0,0,1,3,5Z"/>
                            </svg>
                        </Link>
                    </li>
                )) }
            </ul>
        </div>
    )
}