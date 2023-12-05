'use client'

import { useEffect, useState } from "react";

export default function Timer() {
    const [timer, setTimer] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer + 1)
        }, 1000)
    }, [])

    return (
        <div>
            <p>{timer}</p>
        </div>
    )
}