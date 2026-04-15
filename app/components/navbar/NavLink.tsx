import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

type NavLinkProps = {
    href: LinkProps['href'],
    active: boolean,
    className?: string,
    children: ReactNode,
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>

const NavLink = ({
    href,
    active = false,
    className = '',
    children,
    ...props
}: NavLinkProps) => (
    <Link
        href={href}
        className={`
            ${className}
            inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out
            ${active
                ? 'border-indigo-400 text-gray-900 dark:text-gray-200 focus:border-indigo-700'
                : 'border-transparent text-gray-500 dark:text-white hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
            }
        `}
        {...props}>
            {children}
    </Link>
)

export default NavLink
