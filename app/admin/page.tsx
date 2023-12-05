'use client'

import { useEffect } from "react"
import { useAuthContext } from "../context/auth-context"
import { useRouter } from "next/navigation"
import TinyMCE from "../components/tinymce"

export default function Admin() {
    const { user } = useAuthContext()
    const router = useRouter()

    useEffect(() => {
        if (user == null) router.push("/signin")
    }, [user, router])

    if (!user) {
        return (<h1>Only logged in users can view this page</h1>)
    }

    return (
        <TinyMCE></TinyMCE>
    )
}