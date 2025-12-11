export const useApi = () => {
    const { token } = useAuth()

    const api = $fetch.create({
        baseURL: process.env.API_BASE_URL || 'http://localhost:3000/api',
        headers: {
            'Content-Type': 'application/json',
            ...(token.value ? { Authorization: `Bearer ${token.value}` } : {})
        },
        onRequest({ request, options }) {
            // Agregar timestamp para cache busting
            if (request.toString().includes('?')) {
                options.query = { ...options.query, _t: Date.now() }
            } else {
                options.query = { _t: Date.now() }
            }
        },
        onResponseError({ response }) {
            // Manejar errores específicos
            if (response.status === 401) {
                // Token expirado
                const { logout } = useAuth()
                logout()
            }

            if (response.status === 403) {
                // Permisos insuficientes
                console.error('Permisos insuficientes')
            }
        }
    })

    return {
        get: (url: string, params?: any) => api(url, { method: 'GET', params }),
        post: (url: string, body?: any) => api(url, { method: 'POST', body }),
        put: (url: string, body?: any) => api(url, { method: 'PUT', body }),
        delete: (url: string) => api(url, { method: 'DELETE' }),
        upload: (url: string, file: File, data?: any) => {
            const formData = new FormData()
            formData.append('file', file)

            if (data) {
                Object.keys(data).forEach(key => {
                    formData.append(key, data[key])
                })
            }

            return api(url, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }
    }
}
