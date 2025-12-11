export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const type = body.reportType

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500))

  let data = []

  if (type === 'monthly_exams') {
    data = [
      { mes: 'Enero', total: 120, costo_promedio: 150.00, facturado: 18000 },
      { mes: 'Febrero', total: 145, costo_promedio: 148.50, facturado: 21532 },
      { mes: 'Marzo', total: 135, costo_promedio: 152.00, facturado: 20520 }
    ]
  } else if (type === 'ingresos_empresa') {
    data = [
      { empresa: 'Minería Yanacocha', atenciones: 450, total_sin_igv: 45000, estado: 'Al día' },
      { empresa: 'Graña y Montero', atenciones: 320, total_sin_igv: 32500, estado: 'Pendiente' },
      { empresa: 'Transportes Línea', atenciones: 280, total_sin_igv: 28000, estado: 'Al día' }
    ]
  } else {
    data = [
      { tipo: 'Apto', cantidad: 850, porcentaje: '68%' },
      { tipo: 'Apto con Restricción', cantidad: 250, porcentaje: '20%' },
      { tipo: 'No Apto', cantidad: 150, porcentaje: '12%' }
    ]
  }

  return {
    success: true,
    data
  }
})