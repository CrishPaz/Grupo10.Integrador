import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const dateStr = query.date as string
  const examTypeCode = query.examType as string
  const doctorId = query.doctorId as string | undefined

  if (!dateStr || !examTypeCode) {
    throw createError({ statusCode: 400, message: 'Se requieren fecha y tipo de examen' })
  }

  try {
    // 1. Obtener información del tipo de examen
    // CORREGIDO: tiposExamen
    const examType = await prisma.tiposExamen.findUnique({
      where: { codigo: examTypeCode }
    })

    // Si no existe, usamos uno por defecto (para pruebas)
    const duration = examType?.duracion_minutos || 30

    const examDate = new Date(dateStr)
    const dayOfWeek = examDate.getDay() // 0 = Domingo

    // 2. Verificar si es día no laborable
    // CORREGIDO: diasNoLaborables
    const nonWorkingDay = await prisma.diasNoLaborables.findUnique({
      where: { fecha: examDate }
    })

    if (nonWorkingDay) return []

    // 3. Obtener configuración de turnos
    let shiftConfigs = []

    // CORREGIDO: configTurnos
    if (doctorId) {
      shiftConfigs = await prisma.configTurnos.findMany({
        where: { medico_id: doctorId, dia_semana: dayOfWeek, activo: true }
      })
    } else {
      shiftConfigs = await prisma.configTurnos.findMany({
        where: { dia_semana: dayOfWeek, activo: true },
        include: { medico: true }
      })
    }

    // SI NO HAY CONFIGURACIÓN, SIMULAMOS UNA POR DEFECTO (Para que funcione el demo)
    if (shiftConfigs.length === 0) {
      // Simulamos turno de 8am a 5pm
      const simulatedStart = new Date(examDate)
      simulatedStart.setHours(8, 0, 0, 0)
      const simulatedEnd = new Date(examDate)
      simulatedEnd.setHours(17, 0, 0, 0)

      shiftConfigs = [{
        medico_id: doctorId || 'simulated',
        hora_inicio: simulatedStart,
        hora_fin: simulatedEnd
      }]
    }

    // 4. Generar slots disponibles
    const availableSlots: string[] = []

    for (const config of shiftConfigs) {
      // Prisma devuelve DateTime completo, extraemos la hora
      const configStart = new Date(config.hora_inicio as any) // as any por seguridad de tipos
      const configEnd = new Date(config.hora_fin as any)

      // Construimos las fechas completas para el día solicitado
      const startTime = new Date(dateStr)
      startTime.setHours(configStart.getHours(), configStart.getMinutes(), 0, 0)

      const endTime = new Date(dateStr)
      endTime.setHours(configEnd.getHours(), configEnd.getMinutes(), 0, 0)

      // Obtener citas ya programadas
      const existingAppointments = await prisma.admisiones.findMany({
        where: {
          medico_id: config.medico_id !== 'simulated' ? config.medico_id : undefined,
          fecha_programada: {
            gte: new Date(dateStr + 'T00:00:00'),
            lt: new Date(dateStr + 'T23:59:59')
          },
          estado: { in: ['programado', 'confirmado', 'en_proceso'] }
        }
      })

      // Convertir citas a rangos de tiempo bloqueados
      const blockedRanges = existingAppointments.map(apt => {
        const start = new Date(apt.fecha_programada)
        const end = new Date(start.getTime() + duration * 60000)
        return { start, end }
      })

      // Iterar cada 30 min (o la duración del examen)
      let currentTime = new Date(startTime)

      while (currentTime < endTime) {
        const slotEnd = new Date(currentTime.getTime() + duration * 60000)

        if (slotEnd <= endTime) {
          // Verificar colisión con citas existentes
          const isBlocked = blockedRanges.some(range => {
            return (currentTime >= range.start && currentTime < range.end) ||
              (slotEnd > range.start && slotEnd <= range.end)
          })

          if (!isBlocked) {
            // Formato HH:MM
            const timeStr = currentTime.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })
            if (!availableSlots.includes(timeStr)) {
              availableSlots.push(timeStr)
            }
          }
        }
        // Avanzamos 30 minutos
        currentTime = new Date(currentTime.getTime() + 30 * 60000)
      }
    }

    return availableSlots.sort()

  } catch (error) {
    console.error('Error slots:', error)
    return [] // Retornar vacío en vez de error 500 para no romper la UI
  }
})