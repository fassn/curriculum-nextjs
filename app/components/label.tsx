import { ReactNode } from 'react'

type LabelProps = {
    className?: string,
    children: ReactNode,
    htmlFor?: string,
    props?: any[],
}

const Label = ({ className, children, htmlFor, ...props }: LabelProps) => (
    <label
        className={`${className} block font-medium text-sm text-gray-700`}
        htmlFor={htmlFor}
        {...props}>
        {children}
    </label>
)

export default Label
