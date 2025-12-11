export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkAuth, user } = useAuth()
  
  // Verificar autenticación
  const isAuthenticated = await checkAuth()
  
  if (!isAuthenticated) {
    // Como no tenemos página de login aún, redirigimos al home o mostramos error
    return navigateTo('/login')
  }
  
  // Verificar rol de administrador
  if (user.value?.rol !== 'admin') {
    // Registrar intento de acceso no autorizado
    // Nota: Usamos try/catch para que si falla el log, no rompa la redirección
    try {
        await $fetch('/api/admin/audit-logs', {
        method: 'POST',
        body: {
            usuario_id: user.value?.id,
            accion: 'UNAUTHORIZED_ACCESS_ATTEMPT',
            modulo: 'admin',
            detalles: `Intento de acceso a ruta de administración: ${to.path}`,
            // Nota: Estos headers pueden venir vacíos en el servidor, usamos 'unknown' por seguridad
            ip_address: 'unknown', 
            user_agent: 'unknown'
        }
        })
    } catch (e) {
        console.error('No se pudo registrar log de auditoría', e)
    }
    
    useToast().error('Acceso no autorizado')
    return navigateTo('/')
  }
})