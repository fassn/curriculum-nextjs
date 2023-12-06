'use client'

import { child, get, getDatabase, ref } from "firebase/database";
import firebaseApp from "@/app/firebase/config";
import TinyMCE from "@/app/components/tinymce";

export default function EditPost({ params}: { params: { blogId: string }}) {
    const db = getDatabase(firebaseApp)

    get(child(ref(db), '/posts/' + params.blogId)).then(snapshot => {
        if (snapshot.exists()) {
            const post = snapshot.val()
            console.log(post.content);
        }
    })

    return (
        <>
            <div>My Post: {params.blogId}</div>
            <TinyMCE></TinyMCE>
        </>
    )
}