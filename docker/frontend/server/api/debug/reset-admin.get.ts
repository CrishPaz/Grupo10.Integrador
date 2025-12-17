import { defineEventHandler } from 'h3'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const adminEmail = 'admin@clinica.com'
        const adminPassword = 'Admin123!'
        const hashedPassword = await bcrypt.hash(adminPassword, 10)

        // Buscar si existe
        const existingUser = await prisma.usuarios.findUnique({
            where: { email: adminEmail }
        })

        if (existingUser) {
            // Actualizar
            await prisma.usuarios.update({
                where: { email: adminEmail },
                data: {
                    password_hash: hashedPassword,
                    activo: true,
                    rol: 'admin'
                }
            })
            return { success: true, message: 'Usuario admin actualizado correctamente', user: adminEmail }
        } else {
            // Crear
            await prisma.usuarios.create({
                data: {
                    email: adminEmail,
                    nombres: 'Administrador',
                    apellidos: 'Sistema',
                    dni: '00000000',
                    password_hash: hashedPassword,
                    rol: 'admin',
                    activo: true,
                    telefono: '999999999'
                }
            })
            return { success: true, message: 'Usuario admin creado correctamente', user: adminEmail }
        }

    } catch (error: any) {
        return {
            success: false,
            error: error.message || 'Error desconocido'
        }
    }
})
