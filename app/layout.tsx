import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/navbar'
import Provider from './components/theme-provider'

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
        <body className={inter.className + ' dark:bg-[#23272f]'}>
            <Provider>
                <Navbar />
                <main>
                    {children}
                </main>
            </Provider>
        </body>
    </html>
    )
}
