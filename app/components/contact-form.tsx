'use client'

import { useState } from 'react'
// import axios from '../../lib/axios'
import Input from './input'
import Label from './label'
import GoogleReCaptchaWrapper from './google-recaptcha-wrapper'
import Textarea from './textarea'
// import ValidationErrors from '../ValidationErrors'

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

    // const sendEmail = async ({ setErrors, ...props }) => {
    //     setErrors([])

    //     axios.post('api/message', props).catch(error => {
    //         if (error.response.status !== 422) throw error

    //         setErrors(Object.values(error.response.data.errors).flat())
    //     })
    // }

    const submitForm = async event => {
        event.preventDefault()

        // sendEmail({ email, title, message, setErrors })
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
            {/* <ValidationErrors className="mb-4" errors={errors} /> */}

            <form onSubmit={submitForm} className="max-w-lg">
                {/* Email Address */}
                <div>
                    <Label htmlFor="email">Email</Label>

                    <Input
                        id="email"
                        type="email"
                        value={email}
                        className="block mt-1 w-full"
                        onChange={event => setEmail(event.target.value)}
                        required
                    />
                </div>

                {/* Title */}
                <div className="mt-4">
                    <Label htmlFor="title">Title</Label>

                    <Input
                        id="title"
                        type="text"
                        value={title}
                        className="block mt-1 w-full"
                        onChange={event => setTitle(event.target.value)}
                        required
                        autoComplete="current-title"
                    />
                </div>

                {/* Message */}
                <div className="mt-4">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                        id="message"
                        type="text"
                        value={message}
                        className="block mt-1 w-full"
                        onChange={event => setMessage(event.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <button
                        type='submit'
                        className={`w-full items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
                    >
                        Send Message
                    </button>
                </div>
            </form>
        </div>
    )
}