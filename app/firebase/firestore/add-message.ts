import firebaseApp from "../config"
import { getDatabase, ref, set } from "firebase/database"
import { now } from "moment";
import { getRandomUUID } from "./utils";

export type AddMessageResponse = {
    id?: string,
    error?: string
}

export default async function addMessage(email: string, title: string, message: string): Promise<AddMessageResponse|undefined> {
    const db = getDatabase(firebaseApp)
    const id = getRandomUUID()
    const timestamp = now()

    return set(ref(db, 'messages/' + id), {
        email,
        title,
        message,
        timestamp
    })
    .then(() => { return { id }})
    .catch(e => {
        if (e.code === 'PERMISSION_DENIED') { // Form data is not validated on Firebase Realtime Database
            return { error: 'Message was not sent. Please verify that the email is correct and the fields are filled.' }
        }
    })
}