import firebaseApp from "../config"
import { child, get, getDatabase, ref } from "firebase/database"

export default async function getPosts() {
    const db = getDatabase(firebaseApp)

    return get(child(ref(db), 'posts/')).then(snapshot => {
        if (!snapshot.exists())
            new Error('No posts available.')
        else {
            return snapshot.val()
        }
    }).catch(e => {
        console.log(e)
    })
}