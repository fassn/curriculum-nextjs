
"use client";

import { useTheme } from "next-themes";
// import { SunIcon } from '@heroicons/react/24/outline';
// import { MoonIcon } from '@heroicons/react/24/solid';
import darkmode from '/public/dark-mode-icon.png'
import lightmode from '/public/light-mode-icon.png'
import Image from "next/image";

const ThemeSwitcher = () => {
    const {systemTheme, theme, setTheme } = useTheme()

    const renderThemeChanger= () => {
        const currentTheme = theme === "system" ? systemTheme : theme ;

        if(currentTheme ==="dark") {
            return (
                <Image
                    className="mr-5"
                    src={lightmode}
                    alt='light mode icon'
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
                    className="mr-5"
                    src={darkmode}
                    alt='dark mode icon'
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