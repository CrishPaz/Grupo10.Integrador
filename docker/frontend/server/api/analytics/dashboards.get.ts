export default defineEventHandler(async (event) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        success: true,
        data: {
            summary: {
                total_atenciones: 1250,
                empresas_activas: 45,
                ingresos_totales: 156000.50
            },
            trends: [
                { mes: 'Ene', total_examenes: 120, aptos: 110 },
                { mes: 'Feb', total_examenes: 145, aptos: 130 },
                { mes: 'Mar', total_examenes: 135, aptos: 125 },
                { mes: 'Abr', total_examenes: 160, aptos: 150 },
                { mes: 'May', total_examenes: 180, aptos: 165 },
                { mes: 'Jun', total_examenes: 210, aptos: 190 }
            ],
            topCompanies: [
                { id: 1, empresa: 'Minería Yanacocha', total: 45000 },
                { id: 2, empresa: 'Constructora Graña', total: 32500 },
                { id: 3, empresa: 'Transportes Línea', total: 28000 },
                { id: 4, empresa: 'Servicios Generales', total: 15000 },
                { id: 5, empresa: 'Agroindustrial Paramonga', total: 12000 }
            ]
        }
    }
})