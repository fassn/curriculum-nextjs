import Link from 'next/link'
import type { LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Menu } from '@headlessui/react'

type dropdownLinkProps = {
    href: LinkProps['href'],
    children: ReactNode,
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>

export const DropdownLink = ({ href, children, ...props }: dropdownLinkProps) => (
    <Menu.Item>
        {({ active }) => (
            <Link
                href={href}
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}
                {...props}>
                    {children}
            </Link>
        )}
    </Menu.Item>
)

type dropdownButtonProps = {
    onClick: () => void,
    children: ReactNode,
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>

export const DropdownButton = ({ children, onClick, ...props }: dropdownButtonProps) => (
    <Menu.Item>
        {({ active }) => (
            <button
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}
                onClick={onClick}
                {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
)
