import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    // Simulamos seguridad básica por ahora, igual que otros endpoints
    // En producción deberíamos usar requireAdmin(event)

    try {
        const settings = await prisma.configClinica.findFirst()

        if (!settings) {
            // Si no hay configuración, devolvemos un objeto vacío o por defecto
            // Esto permite que el formulario se cargue vacío para crear la primera config
            return {
                nombre: '',
                ruc: '',
                direccion: '',
                telefono: '',
                email: '',
                sunat_usuario: '',
                sunat_ambiente: 'beta',
                logo: null
            }
        }

        // Convertir el Buffer del logo a base64 string si existe, para que el frontend lo pueda mostrar
        let logoBase64 = null
        if (settings.logo) {
            // Asumimos png o detectamos mime_type si lo guardamos
            const mime = settings.logo_mime_type || 'image/png'
            logoBase64 = `data:${mime};base64,${settings.logo.toString('base64')}`
        }

        return {
            ...settings,
            logo: logoBase64,
            // No devolvemos la contraseña de SUNAT por seguridad (o la devolvemos enmascarada)
            sunat_password: settings.sunat_password ? '********' : ''
        }

    } catch (error) {
        console.error('Error obteniendo configuración:', error)
        throw createError({
            statusCode: 500,
            message: 'Error al cargar la configuración'
        })
    }
})
