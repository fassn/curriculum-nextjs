import firebaseApp from "../config"
import { getDatabase, ref, set } from "firebase/database"
import { randomBytes } from "crypto";


export default async function addMessage(email, title, message) {
    const db = getDatabase(firebaseApp)
    const id = getRandomUUID()
    console.log({id});
    set(ref(db, 'messages/' + id), {
        email,
        title,
        message
    })
}

function getRandomUUID(){
    if (typeof window === "undefined"){
        return randomBytes(16).toString('hex')
    }
    return crypto.randomUUID();
}