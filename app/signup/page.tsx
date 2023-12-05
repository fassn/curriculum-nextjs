'use client'

import { useState } from "react"
import Input from "../components/input"
import Label from "../components/label"

import signUp from "../firebase/auth/signup"
import { useRouter } from 'next/navigation'

export default function Signup() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSubmit = async (event) => {
        event.preventDefault()

        const { result, error } = await signUp(email, password);

        if (error) {
            return console.log(error)
        }

        return router.push("/admin")
    }
    return (

        /* This page is temporarily redirected to root in middleware.ts ! */

        <div className="flex min-h-[80vh]">
            <form onSubmit={handleSubmit} id='login_form' className="w-full max-w-lg m-auto">
                {/* Email Address */}
                <Label htmlFor="email" className='dark:text-white'>Email</Label>

                <Input
                    id="email"
                    type="email"
                    value={email}
                    className="block mt-1 w-full dark:bg-gray-200 dark:text-charcoal"
                    onChange={event => setEmail(event.target.value)}
                    tabIndex={1}
                    required
                />

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password" className='dark:text-white'>Password</Label>

                    <Input
                        id="password"
                        type="text"
                        value={password}
                        className="block mt-1 w-full dark:bg-gray-200 dark:text-charcoal"
                        onChange={event => setPassword(event.target.value)}
                        tabIndex={1}
                        required
                        autoComplete="current-title"
                    />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end mt-4">
                    <button
                        type='submit'
                        className={`w-full items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-700 uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
                        tabIndex={1}
                    >
                        Sign Up
                    </button>
                </div>
            </form>
        </div>
    )
}