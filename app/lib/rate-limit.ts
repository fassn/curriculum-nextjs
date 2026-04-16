import { createHash } from 'node:crypto'
import { Prisma } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'

type RateLimiterOptions = {
    prefix: string
    windowMs: number
    maxRequests: number
    maxBlockMs?: number
}

type RateLimitResult = {
    limited: boolean
    retryAfterSeconds?: number
}

const DEFAULT_MAX_BLOCK_MS = 60 * 60 * 1000

function hashIdentifier(value: string): string {
    return createHash('sha256').update(value).digest('hex')
}

function buildBucketKey(prefix: string, identifier: string): string {
    return `${prefix}:${hashIdentifier(identifier)}`
}

function getRetryAfterSeconds(blockedUntil: Date, now: number): number {
    return Math.max(1, Math.ceil((blockedUntil.getTime() - now) / 1000))
}

async function withSerializableRetry<T>(operation: () => Promise<T>, retries = 3): Promise<T> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await operation()
        } catch (error) {
            const isSerializationConflict =
                error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034'

            if (!isSerializationConflict || attempt === retries - 1) {
                throw error
            }
        }
    }

    throw new Error('Rate limit transaction retry exhausted.')
}

export function createRateLimiter({
    prefix,
    windowMs,
    maxRequests,
    maxBlockMs = DEFAULT_MAX_BLOCK_MS,
}: RateLimiterOptions) {
    return {
        async check(identifier: string): Promise<RateLimitResult> {
            const bucketKey = buildBucketKey(prefix, identifier)

            return withSerializableRetry(async () => {
                const now = Date.now()
                const nowDate = new Date(now)
                const windowExpiresAt = new Date(now + windowMs)

                return prisma.$transaction(async (tx) => {
                    const bucket = await tx.rateLimitBucket.findUnique({
                        where: { key: bucketKey },
                    })

                    if (!bucket) {
                        await tx.rateLimitBucket.create({
                            data: {
                                key: bucketKey,
                                count: 1,
                                windowStartedAt: nowDate,
                                expiresAt: windowExpiresAt,
                            },
                        })
                        return { limited: false }
                    }

                    if (bucket.blockedUntil && bucket.blockedUntil > nowDate) {
                        return {
                            limited: true,
                            retryAfterSeconds: getRetryAfterSeconds(bucket.blockedUntil, now),
                        }
                    }

                    if (bucket.expiresAt <= nowDate) {
                        await tx.rateLimitBucket.update({
                            where: { key: bucketKey },
                            data: {
                                count: 1,
                                windowStartedAt: nowDate,
                                blockedUntil: null,
                                expiresAt: windowExpiresAt,
                            },
                        })
                        return { limited: false }
                    }

                    const nextCount = bucket.count + 1
                    if (nextCount <= maxRequests) {
                        await tx.rateLimitBucket.update({
                            where: { key: bucketKey },
                            data: { count: nextCount },
                        })
                        return { limited: false }
                    }

                    const overflow = nextCount - maxRequests
                    const blockDurationMs = Math.min(windowMs * 2 ** (overflow - 1), maxBlockMs)
                    const blockedUntil = new Date(now + blockDurationMs)

                    await tx.rateLimitBucket.update({
                        where: { key: bucketKey },
                        data: {
                            count: nextCount,
                            blockedUntil,
                            expiresAt: blockedUntil,
                        },
                    })

                    return {
                        limited: true,
                        retryAfterSeconds: getRetryAfterSeconds(blockedUntil, now),
                    }
                }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
            })
        },
    }
}
