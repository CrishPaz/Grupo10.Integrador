import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  const password = 'Admin123!' // Cambiar en producción
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  try {
    const admin = await prisma.usuarios.create({
      data: {
        dni: '00000000',
        email: 'admin@clinica.com',
        password_hash: passwordHash,
        nombres: 'Administrador',
        apellidos: 'Del Sistema',
        rol: 'admin',
        activo: true
      }
    })

    console.log('✅ Usuario administrador creado:')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Contraseña:', password)
    console.log('⚠️ IMPORTANTE: Cambia la contraseña después del primer login')
  } catch (error) {
    console.error('❌ Error creando administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()