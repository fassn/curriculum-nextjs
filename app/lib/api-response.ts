import { NextResponse } from 'next/server'

export function jsonError(error: string, status: number, init?: Omit<ResponseInit, 'status'>) {
    return NextResponse.json({ error }, { status, ...init })
}
