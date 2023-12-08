'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Dropdown from './dropdown'
import { DropdownLink } from './dropdown-link'
import NavLink from './navlink'
import ResponsiveNavLink from './responsive-navlink'

import envelope from '/public/envelope.png'
import Image from 'next/image'
import ThemeSwitcher from './theme-switcher'
import { useAuthContext } from '../context/auth-context'
import { getAuth, signOut } from 'firebase/auth'

const Navbar = () => {
    const pathName = usePathname()

    const pdfCV =
        'https://drive.google.com/file/d/1igv7jM2cfg4mRkJoLbW9PpReLOIoXZ5s/view?usp=sharing'

    const [open, setOpen] = useState(false)

    const { user } = useAuthContext()

    const handleSignOut = () => {
        signOut(getAuth())
    }

    return (
        <nav className="fixed top-0 right-0 left-0 mb-40 z-50 bg-white dark:bg-gray-700 border-b border-gray-100 dark:border-none">
            {/* Primary Navigation Menu */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/">↑</Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                className="text-dark-red dark:text-deep-blue"
                                href={pdfCV}
                                target='_blank'
                                active={pathName === '/'}>
                                Download CV in PDF
                            </NavLink>
                        </div>
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href="/blog"
                                active={pathName === '/blog'}>
                                Blog
                            </NavLink>
                        </div>
                        { user ?
                        <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                            <NavLink
                                href="/admin"
                                active={pathName === '/admin'}>
                                Admin
                            </NavLink>
                        </div>
                        : <></>}
                    </div>

                    {/* Settings Dropdown */}
                    <div className="hidden sm:flex sm:items-center sm:ml-6">

                        { /* Sign Out button */ }
                        { user ? <button onClick={handleSignOut} className='text-amber-500'>Logout</button> : <></> }

                        <ThemeSwitcher className='ml-5' />

                        { pathName === '/' && // hide dropdown if not on '/' CV page
                            <Dropdown
                                align="right"
                                width="48"
                                trigger={
                                    <button className="flex items-center ml-5 text-sm font-medium text-gray-500 dark:text-white hover:text-gray-700 focus:outline-none transition duration-150 ease-in-out">
                                        <div>Curriculum Vitae</div>

                                        <div className="ml-1">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                }>
                                <DropdownLink href="#about">About</DropdownLink>
                                <DropdownLink href="#cv">CV</DropdownLink>
                                <DropdownLink href="#ilove">I ♥</DropdownLink>
                                <DropdownLink href="#contact">
                                    <Image
                                        src={envelope}
                                        alt='envelope-icon'
                                    />
                                </DropdownLink>
                            </Dropdown>
                        }
                    </div>

                    {/* Hamburger */}
                    <div className="-mr-2 flex items-center sm:hidden">

                        { /* Sign Out button */ }
                        { user ? <button onClick={handleSignOut} className='text-amber-500'>Logout</button> : <></> }

                        <ThemeSwitcher className='ml-5'/>

                        { pathName === '/' && // hide hamburger menu if not on '/' CV page
                            <button
                                onClick={() => setOpen(open => !open)}
                                className="inline-flex items-center justify-center p-2 rounded-md ml-5 text-gray-400 dark:text-white hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    {open ? (
                                        <path
                                            className="inline-flex"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            className="inline-flex"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        }
                    </div>
                </div>
            </div>

            {/* Responsive Navigation Menu */}
            {open && (
                <div className="block sm:hidden">
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            className="text-dark-red dark:text-deep-blue"
                            href={pdfCV}
                            active={pathName === '/'}>
                            Download CV in PDF
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="#about"
                            active={pathName === '#about'}>
                            About
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="#cv"
                            active={pathName === '#cv'}>
                            CV
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="#ilove"
                            active={pathName === '#ilove'}>
                            I ♥
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href="#contact"
                            active={pathName === '/#contact'}>
                            <Image
                                src={envelope}
                                alt='envelope-icon'
                            />
                        </ResponsiveNavLink>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar