import { ReactNode } from 'react'
import { useEffect } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type recaptchaButtonProps = {
    type?: 'submit' | 'button' | 'reset',
    className?: string,
    children: ReactNode,
    props?: any[],
}

const RecaptchaButton = ({
    type = 'submit',
    className,
    children,
    ...props
}: recaptchaButtonProps) => {
    const { executeRecaptcha } = useGoogleReCaptcha()

    const handleReCaptchaVerify = async () => {
        if (!executeRecaptcha) {
            return
        }

        await executeRecaptcha('contact_form')
    }

    useEffect(() => {
        handleReCaptchaVerify()
    }, [handleReCaptchaVerify])

    return (
        <button
            type={type}
            className={`${className} w-full items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150`}
            onClick={handleReCaptchaVerify}
            {...props}>
            {children}
        </button>
    )
}

export default RecaptchaButton
