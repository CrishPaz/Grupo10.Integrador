
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        // 1. Find a patient
        const patient = await prisma.pacientes.findFirst()
        if (!patient) {
            console.log("No patients found. Cannot test admission creation.")
            return
        }
        console.log(`Found patient: ${patient.id}`)

        // 2. Try to create admission
        const admission = await prisma.admisiones.create({
            data: {
                paciente_id: patient.id,
                tipo_examen: 'Examen de Prueba',
                fecha_programada: new Date(),
                estado: 'programado'
            }
        })
        console.log("Successfully created admission:", admission)

    } catch (error) {
        console.error('Error creating admission manually:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
