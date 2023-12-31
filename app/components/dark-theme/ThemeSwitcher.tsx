
"use client";

import { useTheme } from "next-themes";
// import { SunIcon } from '@heroicons/react/24/outline';
// import { MoonIcon } from '@heroicons/react/24/solid';
import darkmode from '/public/dark-mode-icon.png'
import lightmode from '/public/light-mode-icon.png'
import Image from "next/image";

type themeSwitcherProps = {
    className?: string
}

const ThemeSwitcher = ({ className = '' }: themeSwitcherProps) => {
    const {systemTheme, theme, setTheme } = useTheme()

    const renderThemeChanger= () => {
        const currentTheme = theme === "system" ? systemTheme : theme ;

        if(currentTheme ==="dark") {
            return (
                <Image
                    src={lightmode}
                    alt='light mode icon'
                    className={className}
                    width='24'
                    height='24'
                    style={{ filter: 'invert(1)' }}
                    role="button"
                    onClick={() => setTheme('light')}
                />
            )
        } else {
            return (
                <Image
                    src={darkmode}
                    alt='dark mode icon'
                    className={className}
                    width='24'
                    height='24'
                    role="button"
                    onClick={() => setTheme('dark')}
                />
            )
        }
    }

    return (
        <>
            { renderThemeChanger() }
        </>
    )
}

export default ThemeSwitcher