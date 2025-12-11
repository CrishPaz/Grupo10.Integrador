export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth(); // Usamos nuestro composable existente
  
  // 1. Verificar si está logueado
  if (!user.value) {
    return navigateTo('/login');
  }
  
  // 2. Verificar roles permitidos
  const allowedRoles = ['admin', 'director', 'doctor'];
  
  // Si el rol del usuario NO está en la lista permitida
  if (!allowedRoles.includes(user.value.rol)) {
    // Si tienes un sistema de notificaciones, aquí podrías mostrar un error
    console.warn(`Acceso denegado a ${user.value.nombres} (Rol: ${user.value.rol})`);
    return navigateTo('/admin'); // Redirigir al dashboard general
  }
});