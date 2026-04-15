import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const existingCount = await prisma.post.count()
    if (existingCount > 0) {
        console.log(`[sample posts] skipped: database already has ${existingCount} post(s)`)
        return
    }

    await prisma.post.createMany({
        data: [
            {
                content: '<p>Bienvenue sur le blog local de test. Ceci est un premier billet exemple.</p>',
            },
            {
                content: '<p>Second billet de test: vérification de l’édition, du rendu et de la liste admin.</p>',
            },
        ],
    })

    console.log('[sample posts] inserted 2 sample posts')
}

main()
    .catch((error) => {
        console.error('[sample posts] failed:', error)
        process.exitCode = 1
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
