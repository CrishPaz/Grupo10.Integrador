import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// SIMULACIÓN: Función simplificada para procesar datos sin librerías externas
async function processSimulatedData(data: string, equipo: any): Promise<any[]> {
  try {
    // Intentamos parsear como JSON si viene simulado
    const parsed = JSON.parse(data)
    if (Array.isArray(parsed)) return parsed
    return [parsed]
  } catch (e) {
    // Si no es JSON, asumimos formato simple CSV (parametro,valor)
    return data.split('\n').map(line => {
      const [param, val] = line.split(',')
      return {
        parametro_codigo: param?.trim(),
        resultado: val?.trim(),
        resultado_numerico: parseFloat(val),
        unidad: '', // Se llenará después
        flag: ''
      }
    }).filter(r => r.parametro_codigo && !isNaN(r.resultado_numerico))
  }
}

async function validateAndStoreResults(
  resultados: any[],
  solicitudId: string,
  userId: string,
  equipoId: string
): Promise<any[]> {
  // CORREGIDO: solicitudesLaboratorio
  const solicitud = await prisma.solicitudesLaboratorio.findUnique({
    where: { id: solicitudId },
    include: { tipo_examen: true }
  })

  if (!solicitud) throw new Error('Solicitud no encontrada')

  const resultadosValidados: any[] = []

  for (const resultado of resultados) {
    if (!resultado.parametro_codigo) continue

    // Buscar parámetro en la configuración
    const tipoExamen = solicitud.tipo_examen
    if (!tipoExamen) continue

    const parametros = (tipoExamen.parametros as any[]) || []
    
    // Buscamos coincidencia por código o nombre
    const parametroConfig = parametros.find((p: any) => 
      p.codigo === resultado.parametro_codigo || 
      p.nombre.toLowerCase() === (resultado.parametro_nombre || '').toLowerCase()
    )

    if (!parametroConfig) continue

    // Validar valores
    let resultadoNumerico = resultado.resultado_numerico
    if (isNaN(resultadoNumerico) && parametroConfig.tipo === 'numerico') {
      resultadoNumerico = parseFloat(resultado.resultado)
    }

    // Calcular Flag (Alto/Bajo)
    let flag = resultado.flag || ''
    if (parametroConfig.tipo === 'numerico' && !isNaN(resultadoNumerico)) {
      const min = parametroConfig.valor_minimo
      const max = parametroConfig.valor_maximo
      
      if (resultadoNumerico < min) flag = 'L'
      else if (resultadoNumerico > max) flag = 'H'
    }

    resultadosValidados.push({
      ...resultado,
      parametro_nombre: parametroConfig.nombre, // Aseguramos el nombre correcto
      resultado_numerico: resultadoNumerico,
      flag,
      unidad: parametroConfig.unidad,
      valor_referencia_min: parametroConfig.valor_minimo,
      valor_referencia_max: parametroConfig.valor_maximo
    })
  }

  return resultadosValidados
}

export default defineEventHandler(async (event) => {
  // Verificar permisos
  await requireRole(event, ['lab', 'admin'])
  
  const body = await readBody(event)
  const user = event.context.user

  if (!body.equipo_id || !body.data) {
    throw createError({ statusCode: 400, message: 'Faltan datos requeridos' })
  }

  try {
    // CORREGIDO: equiposLaboratorio
    const equipo = await prisma.equiposLaboratorio.findUnique({
      where: { id: body.equipo_id }
    })

    if (!equipo) throw createError({ statusCode: 404, message: 'Equipo no encontrado' })

    // Procesar datos (Usamos nuestra función simulada universal)
    const resultadosProcesados = await processSimulatedData(body.data, equipo)

    // Validar con la solicitud real
    const resultadosValidados = await validateAndStoreResults(
      resultadosProcesados,
      body.solicitud_id,
      user.id,
      equipo.id
    )

    // Registrar evento en logs del equipo
    // CORREGIDO: logsEquiposLaboratorio
    await prisma.logsEquiposLaboratorio.create({
      data: {
        equipo_id: equipo.id,
        tipo_evento: 'resultado',
        descripcion: 'Resultados importados (Simulado)',
        datos: {
          count: resultadosValidados.length,
          interfaz: equipo.tipo_interfaz
        }
      }
    })

    return {
      success: true,
      message: 'Resultados importados exitosamente',
      resultados: resultadosValidados
    }

  } catch (error: any) {
    console.error('Error interfaz equipo:', error)
    throw createError({
      statusCode: 500,
      message: 'Error en interfaz: ' + error.message
    })
  }
})