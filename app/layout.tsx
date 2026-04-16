import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'quill/dist/quill.snow.css'
import Navbar from './components/navbar/Navbar'
import ThemeSwitcherProvider from './components/dark-theme/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })
const siteUrl = 'https://christopherfargere.com'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Christopher Fargere's Curriculum Vitae",
        template: "%s | Christopher Fargere",
    },
    description: 'Curriculum, portfolio, and blog by Christopher Fargere.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: "Christopher Fargere's Curriculum Vitae",
        description: 'Curriculum, portfolio, and blog by Christopher Fargere.',
        url: siteUrl,
        siteName: 'Christopher Fargere',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: "Christopher Fargere's Curriculum Vitae",
        description: 'Curriculum, portfolio, and blog by Christopher Fargere.',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
    <html lang="en" suppressHydrationWarning>
        <body className={inter.className + ' bg-stone-100 text-gray-900 dark:bg-charcoal dark:text-gray-100'}>
            <ThemeSwitcherProvider>
                <Navbar />
                <main>
                    {children}
                </main>
            </ThemeSwitcherProvider>
        </body>
    </html>
    )
}
