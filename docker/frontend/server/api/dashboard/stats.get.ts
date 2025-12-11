import { defineEventHandler } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Simulación de auth (en producción usar middleware real)
  // const user = event.context.user
  
  const today = new Date()
  today.setHours(0,0,0,0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  try {
    // 1. Citas de Hoy
    const todayAppointments = await prisma.admisiones.count({
      where: {
        fecha_programada: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // 2. Pacientes Activos (Total)
    const activePatients = await prisma.pacientes.count()

    // 3. Ingresos del Mes
    const monthlyRevenue = await prisma.facturas.aggregate({
      where: {
        fecha_emision: { gte: firstDayOfMonth },
        estado_pago: 'PAGADO'
      },
      _sum: { total: true }
    })

    // 4. Tasa de Aptitud (Total evaluados vs Aptos)
    const totalEvaluated = await prisma.conceptoAptitud.count({
      where: { created_at: { gte: firstDayOfMonth } }
    })
    
    const totalAptos = await prisma.conceptoAptitud.count({
      where: { 
        created_at: { gte: firstDayOfMonth },
        resultado: 'APTO'
      }
    })

    const aptitudeRate = totalEvaluated > 0 
      ? Math.round((totalAptos / totalEvaluated) * 100) 
      : 0

    return {
      success: true,
      data: {
        todayAppointments,
        activePatients,
        monthlyRevenue: Number(monthlyRevenue._sum.total || 0),
        aptitudeRate
      }
    }

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return { 
      success: false, 
      data: { 
        todayAppointments: 0, 
        activePatients: 0, 
        monthlyRevenue: 0, 
        aptitudeRate: 0 
      } 
    }
  }
})