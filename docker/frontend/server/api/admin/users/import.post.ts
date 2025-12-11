
import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { PrismaClient } from '@prisma/client'
import ExcelJS from 'exceljs'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // 1. Validar Permisos (Solo Admin - aunque el middleware lo maneja, doble check)
    // TODO: Add strict role check if needed beyond middleware

    // 2. Leer Archivo
    const files = await readMultipartFormData(event)
    if (!files || files.length === 0) {
        throw createError({ statusCode: 400, message: 'No se subió ningún archivo' })
    }

    const file = files[0]
    if (!file.filename || !file.filename.match(/\.(xlsx|xls)$/)) {
        throw createError({ statusCode: 400, message: 'Formato inválido. Use .xlsx o .xls' })
    }

    // 3. Procesar Excel
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(Buffer.from(file.data) as any)

    const worksheet = workbook.getWorksheet(1)
    if (!worksheet) {
        throw createError({ statusCode: 400, message: 'El archivo Excel no tiene hojas' })
    }

    const results = {
        total: 0,
        success: 0,
        errors: [] as string[]
    }

    const usuariosAProcesar: any[] = []

    // Leer filas (asumiendo fila 1 es cabecera)
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return // Saltar cabecera

        // SAFE GUARD: Handle potentially undefined/null cell values
        const dni = (row.getCell(1).text?.toString() || '').trim()
        const nombres = (row.getCell(2).text?.toString() || '').trim()
        const apellidos = (row.getCell(3).text?.toString() || '').trim()
        const email = (row.getCell(4).text?.toString() || '').trim()

        // Normalizar rol: mapping a valores en inglés (DB Constraint)
        let rolRaw = (row.getCell(5).text?.toString() || '').trim().toLowerCase()
        if (!rolRaw) rolRaw = 'doctor' // Default

        const rolMap: Record<string, string> = {
            // Mapping SP -> EN
            'médico': 'doctor',
            'medico': 'doctor',
            'doctor': 'doctor',

            'paciente': 'patient',
            'patient': 'patient',

            'admin': 'admin',
            'administrador': 'admin',

            'laboratorio': 'lab',
            'laboratory': 'lab',
            'lab': 'lab',

            'técnico': 'lab', // Mapped to 'lab' as no 'technician' role exists
            'tecnico': 'lab',
            'technician': 'lab',

            'enfermera': 'doctor', // Fallback to doctor/medical provider
            'enfermero': 'doctor',
            'nurse': 'doctor',

            'admisión': 'admissions',
            'admision': 'admissions',
            'admissions': 'admissions',

            'recepción': 'admissions', // Mapped to admissions
            'recepcion': 'admissions',
            'reception': 'admissions'
        }

        // Intentar mapear, si no existe usar raw (quizás ya está en inglés)
        let rol = rolMap[rolRaw] || rolRaw

        // FAILSAFE: Si el rol final no está en la lista permitida, forzar 'patient' o 'doctor' para evitar crash
        const allowedRoles = ['admin', 'admissions', 'doctor', 'lab', 'patient']
        if (!allowedRoles.includes(rol)) {
            // Si no es válido, loguear y default a patient (menos privilegios)
            console.warn(`Rol desconocido '${rolRaw}' -> '${rol}'. Forzando 'patient'`)
            rol = 'patient'
        }

        const especialidad = (row.getCell(6).text?.toString() || '').trim()
        const colegiatura = (row.getCell(7).text?.toString() || '').trim()

        if (dni && email) {
            usuariosAProcesar.push({ rowNumber, dni, nombres, apellidos, email, rol, especialidad, colegiatura })
        }
    })

    results.total = usuariosAProcesar.length

    // 4. Crear Usuarios
    for (const user of usuariosAProcesar) {
        try {
            // Validar duplicados
            const existing = await prisma.usuarios.findFirst({
                where: { OR: [{ dni: user.dni }, { email: user.email }] }
            })

            if (existing) {
                results.errors.push(`Fila ${user.rowNumber}: Usuario ya existe (DNI o Email duplicado)`)
                continue
            }

            const defaultPassword = await bcrypt.hash('Salud123!', 10)

            await prisma.usuarios.create({
                data: {
                    dni: user.dni,
                    nombres: user.nombres || 'Sin Nombre',
                    apellidos: user.apellidos || 'Sin Apellido',
                    email: user.email,
                    password_hash: defaultPassword,
                    rol: user.rol,
                    especialidad: user.especialidad,
                    colegiatura: user.colegiatura,
                    activo: true
                }
            })

            results.success++
        } catch (error: any) {
            console.error(error)
            results.errors.push(`Fila ${user.rowNumber}: Error al crear usuario - ${error.message}`)
        }
    }

    return results
})
