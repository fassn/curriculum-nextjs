import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
    const password = process.env.ADMIN_PASSWORD

    if (!email || !password) {
        throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required.')
    }

    if (password.length < 12) {
        throw new Error('ADMIN_PASSWORD must be at least 12 characters long.')
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.adminUser.upsert({
        where: { singleton: true },
        update: {
            email,
            passwordHash,
        },
        create: {
            email,
            passwordHash,
        },
    })

    console.log(`[admin seed] Admin user upserted for ${email}`)
}

main()
    .catch((error) => {
        console.error('[admin seed] failed:', error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
