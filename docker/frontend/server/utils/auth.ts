export const mockUser = (role: string = 'admin') => ({
  id: '12345-' + role + '-id',
  rol: role,
  nombres: 'Usuario',
  apellidos: 'Simulado (' + role + ')'
})

export const requireAdmin = (event: any) => {
  // Simulamos usuario admin por defecto si no hay uno
  if (!event.context.user) {
    event.context.user = mockUser('admin');
  }

  if (event.context.user.rol !== 'admin') {
    throw createError({ statusCode: 403, message: 'Se requiere rol: admin' })
  }
  return true;
};

export const requireRole = (event: any, roles: string[]) => {
  // Simulación: Inyectar usuario si no existe (Dev Mode)
  if (!event.context.user) {
    // Por defecto inyectamos admin para no bloquear el desarrollo, 
    // pero en producción esto debería leerse del JWT.
    event.context.user = mockUser('admin');
  }

  const userRole = event.context.user.rol
  if (!roles.includes(userRole) && userRole !== 'admin') {
    throw createError({
      statusCode: 403,
      message: `Acceso denegado. Se requiere uno de: ${roles.join(', ')}`
    })
  }
  return true;
};