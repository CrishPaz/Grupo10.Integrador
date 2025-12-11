
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Checking database connection...')
        const count = await prisma.usuarios.count()
        console.log(`Total users in DB: ${count}`)

        if (count > 0) {
            const users = await prisma.usuarios.findMany({
                take: 5,
                include: { pacientes: true }
            })
            console.log('Sample users:', JSON.stringify(users, null, 2))
        } else {
            console.log("No users found in database.")
        }
    } catch (error) {
        console.error('Error connecting to DB:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
