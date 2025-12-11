
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const items = [
        // Medicamentos
        { codigo: 'MED001', nombre: 'Paracetamol 500mg', categoria: 'MEDICAMENTO', tipo_unidad: 'CAJA', stock_actual: 150, stock_minimo: 50, costo_unitario: 5.50, ubicacion: 'Farmacia - A1', fecha_vencimiento: new Date('2026-12-31') },
        { codigo: 'MED002', nombre: 'Ibuprofeno 400mg', categoria: 'MEDICAMENTO', tipo_unidad: 'CAJA', stock_actual: 80, stock_minimo: 40, costo_unitario: 6.20, ubicacion: 'Farmacia - A2', fecha_vencimiento: new Date('2026-10-15') },
        { codigo: 'MED003', nombre: 'Amoxicilina 500mg', categoria: 'MEDICAMENTO', tipo_unidad: 'CAJA', stock_actual: 45, stock_minimo: 30, costo_unitario: 12.00, ubicacion: 'Farmacia - B1', fecha_vencimiento: new Date('2025-08-20') },
        { codigo: 'MED004', nombre: 'Cetirizina 10mg', categoria: 'MEDICAMENTO', tipo_unidad: 'CAJA', stock_actual: 100, stock_minimo: 20, costo_unitario: 4.50, ubicacion: 'Farmacia - A3', fecha_vencimiento: new Date('2027-01-10') },
        { codigo: 'MED005', nombre: 'Omeprazol 20mg', categoria: 'MEDICAMENTO', tipo_unidad: 'CAJA', stock_actual: 200, stock_minimo: 50, costo_unitario: 8.00, ubicacion: 'Farmacia - B2', fecha_vencimiento: new Date('2026-05-05') },

        // Insumos Médicos
        { codigo: 'INS001', nombre: 'Jeringa 5ml c/aguja', categoria: 'MATERIAL', tipo_unidad: 'CAJA', stock_actual: 500, stock_minimo: 100, costo_unitario: 25.00, ubicacion: 'Almacén - C1', fecha_vencimiento: new Date('2028-01-01') },
        { codigo: 'INS002', nombre: 'Guantes de Nitrilo M', categoria: 'MATERIAL', tipo_unidad: 'CAJA', stock_actual: 20, stock_minimo: 30, costo_unitario: 35.00, ubicacion: 'Almacén - C2', fecha_vencimiento: new Date('2027-06-30') }, // Stock Bajo
        { codigo: 'INS003', nombre: 'Mascarilla N95', categoria: 'MATERIAL', tipo_unidad: 'UNIDAD', stock_actual: 1000, stock_minimo: 200, costo_unitario: 2.50, ubicacion: 'Almacén - D1', fecha_vencimiento: new Date('2029-01-01') },
        { codigo: 'INS004', nombre: 'Alcohol 96° 1L', categoria: 'MATERIAL', tipo_unidad: 'FRASCO', stock_actual: 60, stock_minimo: 20, costo_unitario: 15.00, ubicacion: 'Almacén - E1', fecha_vencimiento: new Date('2026-12-12') },
        { codigo: 'INS005', nombre: 'Gasa Estéril 10x10', categoria: 'MATERIAL', tipo_unidad: 'PAQUETE', stock_actual: 150, stock_minimo: 50, costo_unitario: 18.00, ubicacion: 'Almacén - C3', fecha_vencimiento: new Date('2027-03-20') },

        // Laboratorio
        { codigo: 'LAB001', nombre: 'Reactivo Glucosa', categoria: 'REACTIVOS', tipo_unidad: 'KIT', stock_actual: 4, stock_minimo: 5, costo_unitario: 250.00, ubicacion: 'Refrigerador Lab', fecha_vencimiento: new Date('2025-02-28') }, // Crítico + Por vencer
        { codigo: 'LAB002', nombre: 'Reactivo Colesterol', categoria: 'REACTIVOS', tipo_unidad: 'KIT', stock_actual: 8, stock_minimo: 5, costo_unitario: 280.00, ubicacion: 'Refrigerador Lab', fecha_vencimiento: new Date('2025-04-15') },
        { codigo: 'LAB003', nombre: 'Tubos Vacutainer Rojo', categoria: 'MATERIAL_LAB', tipo_unidad: 'CAJA', stock_actual: 20, stock_minimo: 10, costo_unitario: 45.00, ubicacion: 'Estante Lab', fecha_vencimiento: new Date('2026-09-09') },
        { codigo: 'LAB004', nombre: 'Tubos Vacutainer Lila', categoria: 'MATERIAL_LAB', tipo_unidad: 'CAJA', stock_actual: 25, stock_minimo: 10, costo_unitario: 45.00, ubicacion: 'Estante Lab', fecha_vencimiento: new Date('2026-09-09') },
        { codigo: 'LAB005', nombre: 'Frasco Orina Estéril', categoria: 'MATERIAL_LAB', tipo_unidad: 'BOLSA', stock_actual: 500, stock_minimo: 100, costo_unitario: 0.80, ubicacion: 'Almacén Lab', fecha_vencimiento: new Date('2030-01-01') },

        // Equipos de Protección
        { codigo: 'EPP001', nombre: 'Mandil Descartable', categoria: 'EPP', tipo_unidad: 'UNIDAD', stock_actual: 300, stock_minimo: 100, costo_unitario: 3.00, ubicacion: 'Almacén - F1', fecha_vencimiento: null },
        { codigo: 'EPP002', nombre: 'Gorro Quirúrgico', categoria: 'EPP', tipo_unidad: 'CAJA', stock_actual: 50, stock_minimo: 20, costo_unitario: 15.00, ubicacion: 'Almacén - F2', fecha_vencimiento: null },

        // Otros
        { codigo: 'GEN001', nombre: 'Papel Toalla Interfoliado', categoria: 'GENERAL', tipo_unidad: 'PAQUETE', stock_actual: 40, stock_minimo: 20, costo_unitario: 4.00, ubicacion: 'Limpieza', fecha_vencimiento: null },
        { codigo: 'GEN002', nombre: 'Jabón Líquido 1G', categoria: 'GENERAL', tipo_unidad: 'GALON', stock_actual: 10, stock_minimo: 5, costo_unitario: 25.00, ubicacion: 'Limpieza', fecha_vencimiento: new Date('2026-01-01') },
        { codigo: 'GEN003', nombre: 'Papel Camilla', categoria: 'GENERAL', tipo_unidad: 'ROLLO', stock_actual: 15, stock_minimo: 10, costo_unitario: 12.00, ubicacion: 'Almacén - G1', fecha_vencimiento: null },
    ]

    console.log(`Start seeding ${items.length} inventory items...`)

    for (const item of items) {
        try {
            await prisma.inventarioItems.upsert({
                where: { codigo: item.codigo },
                update: {},
                create: item
            })
            console.log(`Created: ${item.nombre}`)
        } catch (e) {
            console.error(`Failed to create ${item.nombre}:`, e)
        }
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
