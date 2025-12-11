
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const result = await prisma.$queryRaw`
    SELECT conname, pg_get_constraintdef(c.oid) as def
    FROM pg_constraint c
    WHERE c.conname = 'usuarios_rol_check';
  `
    const def = (result as any)[0].def
    console.log('--- START DEF ---')
    for (let i = 0; i < def.length; i += 50) {
        console.log(def.substring(i, i + 50))
    }
    console.log('--- END DEF ---')
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
