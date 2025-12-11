import { ref } from 'vue'

export const useBiometric = () => {
    const isAvailable = ref(false)
    const isEnrolled = ref(false)
    const devices = ref<any[]>([])
    const templates = ref<any[]>([])

    // Verificar disponibilidad de APIs biométricas
    const checkAvailability = async () => {
        // Verificar WebAuthn
        if (window.PublicKeyCredential) {
            isAvailable.value = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        }

        // Verificar WebUSB para dispositivos físicos
        if (navigator.usb) {
            try {
                const usbDevices = await navigator.usb.getDevices()
                devices.value = usbDevices
            } catch (error) {
                console.warn('WebUSB no disponible:', error)
            }
        }

        return isAvailable.value
    }

    // Registrar template biométrico
    const registerTemplate = async (usuarioId: string, tipo: string, template: any) => {
        try {
            const response: any = await $fetch('/api/biometric/register', {
                method: 'POST',
                body: {
                    usuario_id: usuarioId,
                    tipo_biometrico: tipo,
                    template_data: template,
                    quality_score: 85 // Calidad estimada
                }
            })

            if (response.success) {
                isEnrolled.value = true
                return { success: true, templateId: response.id }
            }
        } catch (error: any) {
            return { success: false, error: error.data?.message || 'Error en registro' }
        }
    }

    // Verificar identidad
    const verifyIdentity = async (template: any, deviceSerial?: string) => {
        try {
            const response: any = await $fetch('/api/biometric/verify', {
                method: 'POST',
                body: {
                    template_data: template,
                    device_serial: deviceSerial,
                    tipo_biometrico: 'huella_dactilar'
                }
            })

            return response
        } catch (error: any) {
            return {
                success: false,
                error: error.data?.message || 'Error en verificación'
            }
        }
    }

    // Obtener templates del usuario
    const getUserTemplates = async (usuarioId: string) => {
        try {
            const response: any = await $fetch(`/api/biometric/templates/${usuarioId}`)
            templates.value = response.templates || []
            isEnrolled.value = templates.value.length > 0
            return templates.value
        } catch (error) {
            console.error('Error obteniendo templates:', error)
            return []
        }
    }

    // Capturar huella usando WebAuthn (si está disponible)
    const captureFingerprintWebAuthn = async () => {
        if (!isAvailable.value) {
            throw new Error('Autenticación biométrica no disponible')
        }

        try {
            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge: new Uint8Array(32),
                    rp: {
                        name: 'Sistema de Salud Laboral',
                        id: window.location.hostname
                    },
                    user: {
                        id: new Uint8Array(16),
                        name: 'usuario@saludlaboral.pe',
                        displayName: 'Usuario Salud Laboral'
                    },
                    pubKeyCredParams: [
                        { type: 'public-key', alg: -7 } // ES256
                    ],
                    authenticatorSelection: {
                        authenticatorAttachment: 'platform',
                        userVerification: 'required'
                    },
                    timeout: 60000,
                    attestation: 'direct'
                }
            })

            return credential
        } catch (error) {
            console.error('Error capturando huella con WebAuthn:', error)
            throw error
        }
    }

    // Escanear dispositivos USB conectados
    const scanUSBDevices = async () => {
        if (!navigator.usb) {
            throw new Error('WebUSB no soportado')
        }

        try {
            const device = await navigator.usb.requestDevice({
                filters: [
                    { vendorId: 0x1a86 }, // Dispositivos comunes
                    { vendorId: 0x0483 }
                ]
            })

            await device.open()
            await device.selectConfiguration(1)
            await device.claimInterface(0)

            return device
        } catch (error) {
            console.error('Error escaneando dispositivos USB:', error)
            throw error
        }
    }

    return {
        isAvailable,
        isEnrolled,
        devices,
        templates,
        checkAvailability,
        registerTemplate,
        verifyIdentity,
        getUserTemplates,
        captureFingerprintWebAuthn,
        scanUSBDevices
    }
}
