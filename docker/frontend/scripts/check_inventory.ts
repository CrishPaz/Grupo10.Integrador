
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const count = await prisma.inventarioItems.count()
        console.log(`Total items in DB: ${count}`)

        if (count > 0) {
            const items = await prisma.inventarioItems.findMany({ take: 5 })
            console.log('Sample items:', items)
        }
    } catch (e) {
        console.error('Error connecting to DB:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
