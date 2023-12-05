import Link from 'next/link'
import { ReactNode } from 'react'

type NavLinkProps = {
    href?: string,
    active: boolean,
    className?: string,
    target?: string,
    children: ReactNode,
    props?: any[],
}

const NavLink = ({
    href = '/',
    active = false,
    className = '',
    children,
    ...props
}: NavLinkProps) => (
    <Link
        href={href}
        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${
            active
                ? 'border-indigo-400 text-gray-900 dark:text-gray-200 focus:border-indigo-700'
                : 'border-transparent text-gray-500 dark:text-white hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
        } ${className}`}
        {...props}>
            {children}
    </Link>
)

export default NavLink
