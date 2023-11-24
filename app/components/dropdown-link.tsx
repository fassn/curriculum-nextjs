import { ReactNode } from 'react'
import Link from 'next/link'
import { Menu } from '@headlessui/react'

type dropdownLinkProps = {
    href?: string,
    children: ReactNode,
    props?: any[],
}

const DropdownLink = ({ href, children, ...props }: dropdownLinkProps) => (
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

export const DropdownButton = ({ children, ...props }) => (
    <Menu.Item>
        {({ active }) => (
            <button
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${
                    active ? 'bg-gray-100' : ''
                } focus:outline-none transition duration-150 ease-in-out`}
                {...props}>
                {children}
            </button>
        )}
    </Menu.Item>
)

export default DropdownLink
