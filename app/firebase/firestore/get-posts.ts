import firebaseApp from "../config"
import { child, get, getDatabase, ref } from "firebase/database"

export default async function getPosts() {
    const db = getDatabase(firebaseApp)

    return get(child(ref(db), 'posts/')).then(snapshot => {
        if (snapshot.exists()) {
            return snapshot.val()
        }
        return []
    }).catch(e => {
        console.log(e)
    })
}