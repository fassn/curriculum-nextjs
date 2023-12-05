import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/navbar'
import ThemeSwitcherProvider from './components/theme-provider'
import { AuthContextProvider } from './context/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Christopher Fargere's Curriculum Vitae",
    description: 'A beautiful CV.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
    <html lang="en">
        <body className={inter.className + ' dark:bg-charcoal'}>
            <AuthContextProvider>
                <ThemeSwitcherProvider>
                    <Navbar />
                    <main>
                        {children}
                    </main>
                </ThemeSwitcherProvider>
            </AuthContextProvider>
        </body>
    </html>
    )
}
