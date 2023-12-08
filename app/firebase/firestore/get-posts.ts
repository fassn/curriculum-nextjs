import { Post } from "@/app/types/post"
import firebaseApp from "../config"
import { child, get, getDatabase, ref } from "firebase/database"

export default async function getPosts(): Promise<[key: string, Post][]> {
    const db = getDatabase(firebaseApp)

    return get(child(ref(db), 'posts/')).then(snapshot => {
        if (snapshot.exists()) {
            return sortPostsByDescDate(Object.entries(snapshot.val()))
        }
        return []
    })

    function sortPostsByDescDate(posts: [key: string, Post][]) {
        posts.sort((a, b) => {
            if (a[1].date > b[1].date) return -1
            if (a[1].date < b[1].date) return 1
            if (a[1].date == b[1].date) return 0
        })
        return posts
    }

}