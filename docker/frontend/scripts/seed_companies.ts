
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const companies = [
        {
            ruc: '20100000001',
            razon_social: 'Minería del Sur S.A.C.',
            direccion: 'Av. Industrial 123, Arequipa',
            telefono: '054-202020',
            contacto_nombre: 'Ing. Roberto Mamani',
            contacto_email: 'roberto@surmining.pe',
            activo: true
        },
        {
            ruc: '20200000002',
            razon_social: 'Constructora Los Andes S.A.',
            direccion: 'Jr. Puno 456, Lima',
            telefono: '01-4445555',
            contacto_nombre: 'Arq. Luisa Flores',
            contacto_email: 'lflores@andesconst.com',
            activo: true
        },
        {
            ruc: '20300000003',
            razon_social: 'Agroindustrial Valle Verde E.I.R.L.',
            direccion: 'Carretera Central Km 10, Junín',
            telefono: '064-333444',
            contacto_nombre: 'Carlos Vega',
            contacto_email: 'carlos@valleverde.pe',
            activo: true
        },
        {
            ruc: '20400000004',
            razon_social: 'Transportes Rápidos Perú S.A.C.',
            direccion: 'Av. Elmer Faucett 888, Callao',
            telefono: '01-5556666',
            contacto_nombre: 'Miguel Torres',
            contacto_email: 'mtorres@transrapidos.pe',
            activo: true
        },
        {
            ruc: '20500000005',
            razon_social: 'Tecnología e Innovación S.A.',
            direccion: 'Calle Las Begonias 120, San Isidro',
            telefono: '01-2223333',
            contacto_nombre: 'Ana Rojas',
            contacto_email: 'arojas@tecnoinnova.pe',
            activo: true
        },
        {
            ruc: '20600000006',
            razon_social: 'Pesquera Mar Azul S.A.C.',
            direccion: 'Av. Costanera 200, Chimbote',
            telefono: '043-444777',
            contacto_nombre: 'Jose Pardo',
            contacto_email: 'jpardo@marazul.pe',
            activo: true
        },
        {
            ruc: '20700000007',
            razon_social: 'Textiles Hilos de Oro S.R.L.',
            direccion: 'Av. Gamarra 1500, La Victoria',
            telefono: '01-3338888',
            contacto_nombre: 'Rosa Quispe',
            contacto_email: 'rquispe@hilosdeoro.pe',
            activo: true
        },
        {
            ruc: '20800000008',
            razon_social: 'Clínica San Juan S.A.',
            direccion: 'Av. Arequipa 3030, San Isidro',
            telefono: '01-4449999',
            contacto_nombre: 'Dr. Pedro Castillo',
            contacto_email: 'pcastillo@sanjuan.pe',
            activo: true
        },
        {
            ruc: '20900000009',
            razon_social: 'Seguridad Total S.A.C.',
            direccion: 'Calle Los Pinos 400, Miraflores',
            telefono: '01-2424242',
            contacto_nombre: 'Cmdt. Juan Perez',
            contacto_email: 'jperez@seguridadtotal.pe',
            activo: true
        },
        {
            ruc: '20101010101',
            razon_social: 'Alimentos del Norte S.A.',
            direccion: 'Panamericana Norte Km 500, Trujillo',
            telefono: '044-666111',
            contacto_nombre: 'Maria Lopez',
            contacto_email: 'mlopez@alinor.pe',
            activo: true
        }
    ]

    console.log(`Start seeding ${companies.length} companies...`)

    for (const company of companies) {
        // Upsert to avoid duping if run multiple times
        const created = await prisma.empresas.upsert({
            where: { ruc: company.ruc },
            update: {},
            create: company
        })
        console.log(`Created company: ${created.razon_social}`)
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
