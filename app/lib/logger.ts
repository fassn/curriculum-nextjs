type LogContext = Record<string, unknown>

function serializeError(error: unknown) {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
            stack: error.stack,
        }
    }
    return { value: String(error) }
}

export function logError(event: string, error: unknown, context: LogContext = {}) {
    console.error(
        JSON.stringify({
            level: 'error',
            event,
            ...context,
            error: serializeError(error),
        })
    )
}
