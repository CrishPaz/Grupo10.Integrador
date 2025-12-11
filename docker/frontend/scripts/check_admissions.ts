
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const count = await prisma.admisiones.count()
        console.log(`Total admissions in DB: ${count}`)

        if (count > 0) {
            const admissions = await prisma.admisiones.findMany({
                take: 5,
                include: { paciente: true }
            })
            console.log('Sample admissions:', JSON.stringify(admissions, null, 2))
        }
    } catch (error) {
        console.error('Error connecting to DB:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
