import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const Input = ({ disabled = false, autoFocus = false, className = '', ...props }: InputProps) => (
    <input
        disabled={disabled}
        autoFocus={autoFocus}
        className={`${className} px-2 rounded-md shadow-sm border-gray-300 ring-1 ring-charcoal focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50`}
        {...props}
    />
)

export default Input
