import { prisma } from '~/server/utils/prisma'
import crypto from 'node:crypto'

// const prisma = new PrismaClient() // Removed in favor of singleton


export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. Validar RUC
  if (body.ruc && body.ruc.length !== 11) {
    throw createError({ statusCode: 400, message: 'RUC debe tener 11 dígitos' })
  }

  // 2. CONSTRUCCIÓN DE LISTA BLANCA (Seguridad Total)
  // Solo pasamos a Prisma los campos que existen en la tabla ConfigClinica.
  // Ignoramos id, created_at, updated_at, maintenance_mode, timezone, etc.
  const dataToSave: any = {
    nombre: body.nombre,
    ruc: body.ruc,
    direccion: body.direccion,
    telefono: body.telefono,
    email: body.email,
    sunat_usuario: body.sunat_usuario,
    sunat_ambiente: body.sunat_ambiente
  }

  // 3. Procesar Logo (Si viene nuevo)
  if (body.logo && typeof body.logo === 'string') {
    // Si es una imagen en base64 (data:image/...)
    if (body.logo.startsWith('data:')) {
      const base64Data = body.logo.replace(/^data:image\/\w+;base64,/, "")
      dataToSave.logo = Buffer.from(base64Data, 'base64')
    }
    // Si no empieza con data:, asumimos que no cambió o es null, así que no lo tocamos
  }

  // 4. Encriptar contraseña SUNAT (Solo si el usuario escribió una nueva)
  if (body.sunat_password && body.sunat_password.length > 0) {
    // Si la contraseña ya viene encriptada (empieza con 'enc_') o no cambió, no la tocamos.
    // Aquí asumimos que si el usuario escribe algo, es texto plano que debemos encriptar.
    const secret = process.env.ENCRYPTION_KEY || 'clave_secreta_default_32_bytes_long!!'

    // Fix: createCipher is deprecated. Use createCipheriv.
    // Ensure key is 32 bytes for aes-256-cbc
    const key = crypto.createHash('sha256').update(String(secret)).digest()
    // Using a fixed IV for now to avoid schema changes (since we don't have an IV column)
    // In production, we should store a random IV.
    const iv = Buffer.alloc(16, 0)

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encrypted = cipher.update(body.sunat_password, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    dataToSave.sunat_password = encrypted
  }

  try {
    // 5. Guardar en Base de Datos
    const currentSettings = await prisma.configClinica.findFirst()

    let settings
    if (currentSettings) {
      // ACTUALIZAR: Usamos el ID que ya existe en la base de datos
      settings = await prisma.configClinica.update({
        where: { id: currentSettings.id },
        data: {
          ...dataToSave,
          updated_at: new Date()
        }
      })
    } else {
      // CREAR
      settings = await prisma.configClinica.create({
        data: dataToSave
      })
    }

    return settings

  } catch (error: any) {
    // Imprimimos el error real en la terminal para que puedas verlo si falla
    console.error('ERROR REAL DE PRISMA:', error)
    throw createError({
      statusCode: 500,
      message: 'Error interno: ' + error.message
    })
  }
})