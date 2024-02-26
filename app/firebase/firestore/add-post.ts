import firebaseApp from "../config"
import { getDatabase, ref, set } from "firebase/database"
import moment from "moment";
import { getRandomUUID } from "./utils";
import { setMomentFrenchLocale } from "@/app/utils";

type AddPostResponse = {
    id?: string,
    error?: string
}

export default async function addPost(content: string): Promise<AddPostResponse|undefined> {
    const db = getDatabase(firebaseApp)
    const id = getRandomUUID()
    setMomentFrenchLocale()
    const date = moment().locale('fr').format('LL')

    return set(ref(db, 'posts/' + id), {
        content,
        date
    })
    .then(() => { return { id }})
    .catch(e => {
        if (e.code === 'PERMISSION_DENIED') {
            return { error: 'Post was not saved. Please check your security rules.' }
        }
    })
}