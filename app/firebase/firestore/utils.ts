import { randomBytes, randomUUID } from "crypto";

export function getRandomUUID(){
    if (typeof window === "undefined"){
        return randomBytes(16).toString('hex')
    }
    return randomUUID();
}