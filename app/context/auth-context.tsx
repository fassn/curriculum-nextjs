'use client'

import firebaseApp from '../firebase/config'
import { onAuthStateChanged, getAuth, User } from 'firebase/auth'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const auth = getAuth(firebaseApp)

export const AuthContext = createContext<{ user: User | null }>({ user: null })
export const useAuthContext = () => useContext(AuthContext)

export const AuthContextProvider = ({
    children,
}: { children: ReactNode }) => {
    const [user, setUser] = useState<User|null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            } else {
                setUser(null)
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    )
}