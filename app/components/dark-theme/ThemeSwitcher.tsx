"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import darkmode from '@/public/dark-mode-icon.png'
import lightmode from '@/public/light-mode-icon.png'
import Image from "next/image"

type themeSwitcherProps = {
    className?: string
}

const ThemeSwitcher = ({ className = '' }: themeSwitcherProps) => {
    const { systemTheme, theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // next-themes requires waiting for client mount before reading theme values.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const renderThemeChanger = () => {
        const currentTheme = theme === "system" ? systemTheme : theme
        const isDark = currentTheme === "dark"
        const nextTheme = isDark ? 'light' : 'dark'
        const icon = isDark ? lightmode : darkmode
        const alt = isDark ? 'Switch to light mode' : 'Switch to dark mode'

        return (
            <button
                type="button"
                onClick={() => setTheme(nextTheme)}
                aria-label={alt}
                className={className}
            >
                <Image
                    src={icon}
                    alt={alt}
                    width={24}
                    height={24}
                    style={isDark ? { filter: 'invert(1)' } : undefined}
                />
            </button>
        )
    }

    return renderThemeChanger()
}

export default ThemeSwitcher
