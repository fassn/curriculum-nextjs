import firebaseApp from "../config"
import { getDatabase, ref, set } from "firebase/database"
import { now } from "moment";
import { getRandomUUID } from "./utils";

export default async function addMessage(email, title, message) {
    const db = getDatabase(firebaseApp)
    const id = getRandomUUID()
    const timestamp = now()

    return set(ref(db, 'messages/' + id), {
        email,
        title,
        message,
        timestamp
    }).catch(e => {
        if (e.code === 'PERMISSION_DENIED') { // Form data is not validated on Firebase Realtime Database
            return 'Message was not sent. Please verify that the email is correct and the fields are filled.'
        }
    })
}