import firebaseApp from "../config"
import { getDatabase, ref, set } from "firebase/database"
import moment from "moment";
import { getRandomUUID } from "./utils";

export default async function addPost(content) {
    const db = getDatabase(firebaseApp)
    const id = getRandomUUID()
    const date = moment().locale('fr').format('LL')

    return set(ref(db, 'posts/' + id), {
        content,
        date
    }).catch(e => {
        if (e.code === 'PERMISSION_DENIED') {
            return 'Post was not saved. Please check your security rules.'
        }
    })
}