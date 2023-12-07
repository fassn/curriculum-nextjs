import { Post } from "@/app/types/post"
import firebaseApp from "../config"
import { getDatabase, ref, set } from "firebase/database"

type EditPostResponse = {
    id?: string,
    error?: string
}

export default async function editPost(id, post: Post): Promise<EditPostResponse> {
    const db = getDatabase(firebaseApp)
    return set(ref(db, 'posts/' + id), {
        content: post.content,
        date: post.date
    })
    .then(() => { return { id }})
    .catch(e => {
        if (e.code === 'PERMISSION_DENIED') {
            return { error: 'Post was not saved. Please check your security rules.' }
        }
    })
}