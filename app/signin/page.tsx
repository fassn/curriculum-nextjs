'use client'

import { ChangeEvent, FormEvent, useState } from 'react'
import Input from '../components/form/Input'
import Label from '../components/form/Label'
import ValidationErrors from '../components/form/ValidationErrors'
import { useRouter } from 'next/navigation'
import { signInAdminSession } from '@/app/lib/frontend-api-client'

export default function Signin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setErrors([])
        setIsSubmitting(true)

        try {
            const response = await signInAdminSession({ email, password })
            setIsSubmitting(false)

            if (!response.ok) {
                setErrors([response.error])
                return
            }

            router.push('/admin')
            router.refresh()
        } catch (error) {
            console.error('Admin sign-in failed:', error)
            setIsSubmitting(false)
            setErrors(['Could not sign in. Please try again.'])
        }
    }

    return (
        <div className="flex min-h-[80vh]">
            <form onSubmit={handleSubmit} id='login_form' className="w-full max-w-lg m-auto">
                <ValidationErrors className="mb-4" errors={errors} />
                {/* Email Address */}
                <Label htmlFor="email" className='dark:text-white'>Email</Label>

                <Input
                    id="email"
                    type="email"
                    value={email}
                    className="block mt-1 w-full dark:bg-gray-200 dark:text-charcoal"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    autoFocus={true}
                    tabIndex={1}
                    required
                />

                {/* Password */}
                <div className="mt-4">
                    <Label htmlFor="password" className='dark:text-white'>Password</Label>

                    <Input
                        id="password"
                        type="password"
                        value={password}
                        className="block mt-1 w-full dark:bg-gray-200 dark:text-charcoal"
                        onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                        tabIndex={1}
                        required
                        autoComplete="current-password"
                    />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end mt-4">
                    <button
                        type='submit'
                        className='w-full items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-700 uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150'
                        tabIndex={1}
                        disabled={isSubmitting}
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    )
}
