export default defineNuxtRouteMiddleware((to, from) => {
  const { checkAuth } = useAuth()
  
  // Si la función checkAuth devuelve falso (no logueado)
  // lo mandamos a la página de login
  if (!checkAuth()) {
    return navigateTo('/login')
  }
})