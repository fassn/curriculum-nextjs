import type { Post } from '@/app/types/post'

type JsonRecord = Record<string, unknown>

type ApiSuccess<T> = {
    ok: true
    data: T
}

type ApiFailure = {
    ok: false
    error: string
    status: number
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure

type AdminSessionData = {
    authenticated: boolean
    adminEmail: string | null
}

type ContactPayload = {
    email: string
    title: string
    message: string
    recaptchaToken: string
}

function toRecord(value: unknown): JsonRecord | null {
    return value && typeof value === 'object' ? (value as JsonRecord) : null
}

function getErrorMessage(body: unknown): string | null {
    const record = toRecord(body)
    if (!record || typeof record.error !== 'string') {
        return null
    }

    const error = record.error.trim()
    return error ? error : null
}

async function readJsonBody(response: Response): Promise<unknown> {
    return response.json().catch(() => null)
}

function mapError(
    body: unknown,
    status: number,
    statusMessages: Partial<Record<number, string>>,
    fallback: string
): ApiFailure {
    return {
        ok: false,
        status,
        error: getErrorMessage(body) ?? statusMessages[status] ?? fallback,
    }
}

async function safeFetch(input: RequestInfo | URL, init?: RequestInit): Promise<ApiResult<Response>> {
    try {
        const response = await fetch(input, init)
        return { ok: true, data: response }
    } catch {
        return {
            ok: false,
            status: 0,
            error: 'Could not reach server. Please try again.',
        }
    }
}

function parseAdminSession(body: unknown): AdminSessionData | null {
    const record = toRecord(body)
    if (!record || typeof record.authenticated !== 'boolean') {
        return null
    }

    const adminRecord = toRecord(record.admin)
    const adminEmail = adminRecord && typeof adminRecord.email === 'string' ? adminRecord.email : null
    return {
        authenticated: record.authenticated,
        adminEmail,
    }
}

function parsePostDetails(body: unknown): Post | null {
    const record = toRecord(body)
    const postRecord = toRecord(record?.post)
    if (!postRecord || typeof postRecord.content !== 'string' || typeof postRecord.date !== 'string') {
        return null
    }

    return {
        content: postRecord.content,
        date: postRecord.date,
    }
}

function parsePostMutation(body: unknown): { id: string } | null {
    const record = toRecord(body)
    if (!record || typeof record.id !== 'string' || !record.id.trim()) {
        return null
    }

    return { id: record.id }
}

function parseContactSuccess(body: unknown): boolean {
    const record = toRecord(body)
    return Boolean(record && record.success === true)
}

export async function getAdminSession(): Promise<ApiResult<AdminSessionData>> {
    const responseResult = await safeFetch('/api/admin/session', { cache: 'no-store' })
    if (!responseResult.ok) {
        return responseResult
    }

    const body = await readJsonBody(responseResult.data)
    if (!responseResult.data.ok) {
        return mapError(body, responseResult.data.status, {}, 'Could not read admin session.')
    }

    const session = parseAdminSession(body)
    if (!session) {
        return {
            ok: false,
            status: responseResult.data.status,
            error: 'Could not read admin session.',
        }
    }

    return { ok: true, data: session }
}

export async function signInAdminSession(payload: {
    email: string
    password: string
}): Promise<ApiResult<AdminSessionData>> {
    const responseResult = await safeFetch('/api/admin/session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    if (!responseResult.ok) {
        return responseResult
    }

    const body = await readJsonBody(responseResult.data)
    if (!responseResult.data.ok) {
        return mapError(
            body,
            responseResult.data.status,
            {
                400: 'Invalid sign-in request.',
                401: 'Invalid credentials.',
                429: 'Too many sign-in attempts. Please try again later.',
            },
            'Could not sign in. Please try again.'
        )
    }

    const session = parseAdminSession(body)
    if (!session || !session.authenticated) {
        return {
            ok: false,
            status: responseResult.data.status,
            error: 'Could not sign in. Please try again.',
        }
    }

    return { ok: true, data: session }
}

export async function signOutAdminSession(): Promise<ApiResult<AdminSessionData>> {
    const responseResult = await safeFetch('/api/admin/session', {
        method: 'DELETE',
    })
    if (!responseResult.ok) {
        return responseResult
    }

    const body = await readJsonBody(responseResult.data)
    if (!responseResult.data.ok) {
        return mapError(body, responseResult.data.status, {}, 'Could not terminate admin session.')
    }

    const session = parseAdminSession(body)
    if (!session || session.authenticated) {
        return {
            ok: false,
            status: responseResult.data.status,
            error: 'Could not terminate admin session.',
        }
    }

    return { ok: true, data: session }
}

export async function createPost(payload: {
    content: string
    csrfToken: string
}): Promise<ApiResult<{ id: string }>> {
    const responseResult = await safeFetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': payload.csrfToken,
        },
        body: JSON.stringify({ content: payload.content }),
    })
    if (!responseResult.ok) {
        return responseResult
    }

    const body = await readJsonBody(responseResult.data)
    if (!responseResult.data.ok) {
        return mapError(
            body,
            responseResult.data.status,
            {
                401: 'Your admin session is invalid. Please sign in again.',
                403: 'Your admin session is invalid. Please sign in again.',
            },
            'Post could not be created.'
        )
    }

    const createdPost = parsePostMutation(body)
    if (!createdPost) {
        return {
            ok: false,
            status: responseResult.data.status,
            error: 'Post could not be created.',
        }
    }

    return { ok: true, data: createdPost }
}

export async function updatePost(payload: {
    postId: string
    content: string
    csrfToken: string
}): Promise<ApiResult<{ id: string }>> {
    const responseResult = await safeFetch(`/api/posts/${payload.postId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': payload.csrfToken,
        },
        body: JSON.stringify({ content: payload.content }),
    })
    if (!responseResult.ok) {
        return responseResult
    }

    const body = await readJsonBody(responseResult.data)
    if (!responseResult.data.ok) {
        return mapError(
            body,
            responseResult.data.status,
            {
                401: 'Your admin session is invalid. Please sign in again.',
                403: 'Your admin session is invalid. Please sign in again.',
                404: 'Post not found.',
            },
            'Post could not be updated.'
        )
    }

    const updatedPost = parsePostMutation(body)
    if (!updatedPost) {
        return {
            ok: false,
            status: responseResult.data.status,
            error: 'Post could not be updated.',
        }
    }

    return { ok: true, data: updatedPost }
}

export async function getPostById(postId: string): Promise<ApiResult<Post>> {
    const responseResult = await safeFetch(`/api/posts/${postId}`, {
        method: 'GET',
        cache: 'no-store',
    })
    if (!responseResult.ok) {
        return responseResult
    }

    const body = await readJsonBody(responseResult.data)
    if (!responseResult.data.ok) {
        return mapError(
            body,
            responseResult.data.status,
            {
                404: 'Post not found.',
            },
            'Could not load post.'
        )
    }

    const post = parsePostDetails(body)
    if (!post) {
        return {
            ok: false,
            status: responseResult.data.status,
            error: 'Could not load post.',
        }
    }

    return { ok: true, data: post }
}

export async function submitContactMessage(payload: ContactPayload): Promise<ApiResult<{ success: true }>> {
    const responseResult = await safeFetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
    if (!responseResult.ok) {
        return responseResult
    }

    const body = await readJsonBody(responseResult.data)
    if (!responseResult.data.ok) {
        return mapError(
            body,
            responseResult.data.status,
            {
                429: 'Too many requests. Please try again in a few minutes.',
            },
            'Submission failed.'
        )
    }

    if (!parseContactSuccess(body)) {
        return {
            ok: false,
            status: responseResult.data.status,
            error: 'Submission failed.',
        }
    }

    return { ok: true, data: { success: true } }
}
