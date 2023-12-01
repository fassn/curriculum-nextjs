'use client'

import { useState } from "react"
import Input from "../components/input"
import Label from "../components/label"

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        // TODO
    }

    return (
        <form onSubmit={handleSubmit} id='login_form' className="flex justify-center">
            <div className="w-full max-w-md">
                {/* Email Address */}
                <Label htmlFor="email" className='dark:text-white'>Email</Label>

                <Input
                    id="email"
                    type="email"
                    value={email}
                    className="block mt-1 w-full dark:bg-gray-200"
                    onChange={event => setEmail(event.target.value)}
                    required
                />

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password" className='dark:text-white'>Password</Label>

                    <Input
                        id="password"
                        type="text"
                        value={password}
                        className="block mt-1 w-full dark:bg-gray-200"
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="current-title"
                    />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end mt-4">
                    <button
                        type='submit'
                        className={`w-full items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-700 uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
                    >
                        Login
                    </button>
                </div>
            </div>
        </form>
    )
}