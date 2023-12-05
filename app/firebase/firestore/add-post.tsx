import firebaseApp from "../config"
import { getDatabase, ref, set } from "firebase/database"
import moment from "moment";

export default async function addPost(post) {
    const db = getDatabase(firebaseApp)
    const timestamp = moment().locale('fr').format('LL')

    return set(ref(db, 'posts/' + timestamp), {
        post
    }).catch(e => {
        if (e.code === 'PERMISSION_DENIED') {
            return 'Post was not saved. Please check your security rules.'
        }
    })
}