import { defineEventHandler, readBody } from 'h3'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      return { success: false, error: 'Email y contraseña requeridos' }
    }

    // 1. Buscar usuario
    const usuario = await prisma.usuarios.findUnique({
      where: { email },
      include: { pacientes: { include: { empresa: true } } }
    })

    if (!usuario) {
      return { success: false, error: 'Credenciales incorrectas' }
    }

    // 2. Verificar contraseña
    // Nota: En producción usar bcrypt.compare. Para desarrollo inicial si no has hasheado passwords manuales:
    const passwordValid = await bcrypt.compare(password, usuario.password_hash)
    
    if (!passwordValid) {
      return { success: false, error: 'Credenciales incorrectas' }
    }

    if (!usuario.activo) {
      return { success: false, error: 'Usuario desactivado' }
    }

    // 3. Generar Token
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
        nombre: `${usuario.nombres} ${usuario.apellidos}`
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // 4. Registrar auditoría simple (Login exitoso)
    await prisma.logsAuditoria.create({
      data: {
        usuario_id: usuario.id,
        accion: 'LOGIN',
        modulo: 'AUTH',
        ip_address: event.node.req.socket.remoteAddress
      }
    })

    // Retornar usuario sin datos sensibles
    const { password_hash, huella_dactilar, ...safeUser } = usuario
    
    return {
      success: true,
      token,
      user: safeUser
    }

  } catch (error: any) {
    console.error('Login error:', error)
    return { success: false, error: 'Error interno del servidor' }
  }
})