"use client"

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

type ThemeContextValue = {
    theme: Theme
    systemTheme: ResolvedTheme
    setTheme: (value: Theme) => void
}

type Props = {
    children: React.ReactNode
}

const STORAGE_KEY = 'theme'
const ThemeContext = createContext<ThemeContextValue | null>(null)

function getStoredTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'system'
    }

    const savedTheme = window.localStorage.getItem(STORAGE_KEY)
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        return savedTheme
    }

    return 'system'
}

function getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') {
        return 'light'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyResolvedTheme(theme: Theme, systemTheme: ResolvedTheme) {
    const resolvedTheme = theme === 'system' ? systemTheme : theme
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
}

export default function ThemeSwitcherProvider({ children }: Props) {
    const [theme, setTheme] = useState<Theme>('system')
    const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light')
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(getStoredTheme())
        setSystemTheme(getSystemTheme())
        setHydrated(true)
    }, [])

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => setSystemTheme(getSystemTheme())
        mediaQuery.addEventListener('change', handleChange)
        return () => {
            mediaQuery.removeEventListener('change', handleChange)
        }
    }, [])

    useEffect(() => {
        if (!hydrated) {
            return
        }
        applyResolvedTheme(theme, systemTheme)
        window.localStorage.setItem(STORAGE_KEY, theme)
    }, [hydrated, systemTheme, theme])

    const value = useMemo<ThemeContextValue>(
        () => ({
            theme,
            systemTheme,
            setTheme,
        }),
        [theme, systemTheme]
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used inside ThemeSwitcherProvider.')
    }
    return context
}
