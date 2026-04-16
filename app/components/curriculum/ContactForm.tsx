'use client'

import { ChangeEvent, useState } from 'react'
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import Input from '../form/Input'
import Label from '../form/Label'
import Textarea from '../form/Textarea'
import ValidationErrors from '../form/ValidationErrors'
import { submitContactMessage } from '@/app/lib/frontend-api-client'

export default function WrappedContactForm() {
    const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY

    if (!recaptchaKey) {
        return (
            <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded">
                Contact form is currently unavailable (Missing configuration).
            </div>
        )
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={recaptchaKey}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: 'head',
            }}
        >
            <ContactForm />
        </GoogleReCaptchaProvider>
    )
}

const ContactForm = () => {
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState<string[]>([])
    const [successMessage, setSuccessMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { executeRecaptcha } = useGoogleReCaptcha()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setErrors([])
        setSuccessMessage('')
        setIsSubmitting(true)

        try {
            if (!executeRecaptcha) {
                setErrors(['reCAPTCHA not loaded. Please refresh the page.'])
                setIsSubmitting(false)
                return
            }

            const recaptchaToken = await executeRecaptcha('contact_form_submit')

            if (!recaptchaToken) {
                setErrors(['Captcha verification failed.'])
                setIsSubmitting(false)
                return
            }

            const response = await submitContactMessage({ email, title, message, recaptchaToken })
            if (!response.ok) {
                setErrors([response.error])
                return
            }

            setEmail('')
            setTitle('')
            setMessage('')
            setSuccessMessage('Your message was sent successfully.')
        } catch (err) {
            setErrors(['An unexpected error occurred.'])
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div id="contact" className="max-w-6xl my-4 py-4 px-4 lg:px-8 xl:mx-auto">
            <div>
                <h2 className="text-2xl font-bold">Contact Me</h2>
                <hr className="my-4" />
            </div>

            <ValidationErrors className="mb-4" errors={errors} />

            {successMessage && (
                <div className="mb-4 text-sm text-green-600 font-medium">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-lg">
                <div>
                    <Label htmlFor="email" className='dark:text-white'>Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full dark:bg-gray-200 dark:text-charcoal"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mt-4">
                    <Label htmlFor="title" className='dark:text-white'>Title</Label>
                    <Input
                        id="title"
                        type="text"
                        value={title}
                        className="block mt-1 w-full dark:bg-gray-200 dark:text-charcoal"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        required
                        autoComplete="off"
                    />
                </div>

                <div className="mt-4">
                    <Label htmlFor="message" className='dark:text-white'>Message</Label>
                    <Textarea
                        id="message"
                        value={message}
                        className="block mt-1 w-full dark:bg-gray-200 dark:text-charcoal"
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <button
                        type='submit'
                        disabled={isSubmitting}
                        className="w-full px-4 py-2 bg-gray-800 dark:bg-gray-200 rounded-md font-semibold text-xs text-white dark:text-gray-700 uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition"
                    >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                </div>
            </form>
        </div>
    )
}
