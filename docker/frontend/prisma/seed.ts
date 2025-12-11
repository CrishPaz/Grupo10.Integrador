import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando carga de datos de referencia...')

  // 1. Crear Usuario Admin
  const adminEmail = 'admin@clinica.com'
  const adminPassword = 'Admin123!'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  await prisma.usuarios.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
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

  console.log(`👤 Admin user upserted: ${adminEmail} / ${adminPassword}`)

  const params = [
    // Audiometría
    { tipo_examen: 'audiometria', parametro: 'frecuencia_250', valor_minimo: 0, valor_maximo: 25, unidad: 'dB', interpretacion: 'Normal: ≤25 dB' },
    { tipo_examen: 'audiometria', parametro: 'frecuencia_500', valor_minimo: 0, valor_maximo: 25, unidad: 'dB', interpretacion: 'Normal: ≤25 dB' },
    { tipo_examen: 'audiometria', parametro: 'frecuencia_1000', valor_minimo: 0, valor_maximo: 25, unidad: 'dB', interpretacion: 'Normal: ≤25 dB' },
    { tipo_examen: 'audiometria', parametro: 'frecuencia_2000', valor_minimo: 0, valor_maximo: 25, unidad: 'dB', interpretacion: 'Normal: ≤25 dB' },
    { tipo_examen: 'audiometria', parametro: 'frecuencia_4000', valor_minimo: 0, valor_maximo: 25, unidad: 'dB', interpretacion: 'Normal: ≤25 dB' },
    { tipo_examen: 'audiometria', parametro: 'frecuencia_8000', valor_minimo: 0, valor_maximo: 25, unidad: 'dB', interpretacion: 'Normal: ≤25 dB' },

    // Espirometría
    { tipo_examen: 'espirometria', parametro: 'fvc', valor_minimo: 80, valor_maximo: 120, unidad: '%', interpretacion: 'Normal: 80-120%' },
    { tipo_examen: 'espirometria', parametro: 'fev1', valor_minimo: 80, valor_maximo: 120, unidad: '%', interpretacion: 'Normal: 80-120%' },
    { tipo_examen: 'espirometria', parametro: 'fev1_fvc', valor_minimo: 70, valor_maximo: 100, unidad: '%', interpretacion: 'Normal: ≥70%' },

    // Laboratorio
    { tipo_examen: 'laboratorio', parametro: 'hemoglobina', valor_minimo: 12.0, valor_maximo: 17.5, unidad: 'g/dL', interpretacion: 'H: 13.5-17.5 / M: 12.0-15.5' },
    { tipo_examen: 'laboratorio', parametro: 'glucosa', valor_minimo: 70, valor_maximo: 110, unidad: 'mg/dL', interpretacion: 'Ayunas: 70-110 mg/dL' },
    { tipo_examen: 'laboratorio', parametro: 'colesterol_total', valor_minimo: 0, valor_maximo: 200, unidad: 'mg/dL', interpretacion: 'Deseable: <200 mg/dL' }
  ]

  for (const p of params) {
    await prisma.parametrosExamenes.upsert({
      where: {
        tipo_examen_parametro: { // Este nombre depende de cómo Prisma nombró la clave compuesta
          tipo_examen: p.tipo_examen,
          parametro: p.parametro
        }
      },
      update: {}, // Si existe, no hace nada
      create: p
    })
  }

  console.log('✅ Datos de referencia cargados.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })