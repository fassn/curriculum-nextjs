'use client'

import { useState } from 'react'
import Input from '../form/Input'
import Label from '../form/Label'
import GoogleReCaptchaWrapper from '../form/GoogleReCaptchaWrapper'
import Textarea from '../form/Textarea'
import addMessage from '../../firebase/firestore/add-message'
import ValidationErrors from '../form/ValidationErrors'

export default function WrappedContactForm() {
    return (
        <GoogleReCaptchaWrapper>
            <ContactForm />
        </GoogleReCaptchaWrapper>
    )
}

const ContactForm = () => {
    const [email, setEmail] = useState('')
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState([])

    const handleSubmit = async (event) => {
        event.preventDefault()
        setErrors([])

        const res = await addMessage(email, title, message)
        if (res) {
            setErrors([res])
            return
        }

        setEmail('')
        setTitle('')
        setMessage('')
        setErrors([])
    }

    return (
        <div
            id="contact"
            className="max-w-6xl my-4 py-4 px-4 sm:my-4 sm:mx-4 lg:px-8 xl:mx-auto">
            <div>
                <h2>Contact Me</h2>
                <hr className="my-4" />
            </div>
            {/* Validation Errors */}
            <ValidationErrors className="mb-4" errors={errors} />

            <form onSubmit={handleSubmit} id='contact_form' className="max-w-lg">
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

                {/* Title */}
                <div className="mt-4">
                    <Label htmlFor="title" className='dark:text-white'>Title</Label>

                    <Input
                        id="title"
                        type="text"
                        value={title}
                        className="block mt-1 w-full dark:bg-gray-200 dark:text-charcoal "
                        onChange={event => setTitle(event.target.value)}
                        tabIndex={1}
                        required
                        autoComplete="current-title"
                    />
                </div>

                {/* Message */}
                <div className="mt-4">
                    <Label htmlFor="message" className='dark:text-white'>Message</Label>
                    <Textarea
                        id="message"
                        type="text"
                        value={message}
                        className="block mt-1 w-full dark:bg-gray-200 dark:text-charcoal "
                        onChange={event => setMessage(event.target.value)}
                        tabIndex={1}
                        required
                    />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end mt-4">
                    <button
                        type='submit'
                        className={`w-full items-center px-4 py-2 bg-gray-800 dark:bg-gray-200  border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-700 uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
                        tabIndex={1}
                    >
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    )
}