import { Post } from "@/app/types/post"
import firebaseApp from "../config"
import { child, get, getDatabase, ref } from "firebase/database"

export default async function getPosts(): Promise<[key: string, Post][]> {
    const db = getDatabase(firebaseApp)

    return get(child(ref(db), 'posts/')).then(snapshot => {
        if (snapshot.exists()) {
            return Object.entries(<Post[]>snapshot.val())
        }
        return []
    })
}