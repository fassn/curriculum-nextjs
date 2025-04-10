import { randomBytes } from "crypto";

export function getRandomUUID(){
    if (typeof window === "undefined"){
        return randomBytes(16).toString('hex')
    }
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}