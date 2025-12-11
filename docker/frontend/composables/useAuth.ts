import { defineStore } from 'pinia'
import type { Usuarios } from '@prisma/client'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as Usuarios | null,
    token: null as string | null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.user?.rol,
    userName: (state) =>
      state.user ? `${state.user.nombres} ${state.user.apellidos}` : ''
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const data = await $fetch<{ success: boolean; token?: string; user?: any; error?: string }>('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })

        if (data.success && data.token && data.user) {
          this.user = data.user
          this.token = data.token

          // Guardar en localStorage
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))

          return { success: true }
        }
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || 'Error en autenticación'
        }
      } finally {
        this.loading = false
      }
    },

    async register(userData: any) {
      this.loading = true
      try {
        const data = await $fetch<{ success: boolean; token?: string; user?: any; error?: string }>('/api/auth/register', {
          method: 'POST',
          body: userData
        })

        if (data.success && data.token && data.user) {
          this.user = data.user
          this.token = data.token

          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))

          return { success: true }
        }
      } catch (error: any) {
        return {
          success: false,
          error: error.data?.message || 'Error en registro'
        }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } catch (error) {
        console.error('Error cerrando sesión:', error)
      } finally {
        this.clearAuth()
        navigateTo('/login')
      }
    },

    async checkAuth() {
      const token = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')

      if (!token || !storedUser) {
        this.clearAuth()
        return false
      }

      try {
        // Verificar token con el servidor
        const data = await $fetch<{ valid: boolean }>('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (data.valid) {
          this.user = JSON.parse(storedUser)
          this.token = token
          return true
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
      }

      this.clearAuth()
      return false
    },

    clearAuth() {
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    },

    updateUser(updates: Partial<Usuarios>) {
      if (this.user) {
        this.user = { ...this.user, ...updates }
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    }
  }
})

// Composable para usar en componentes
export const useAuth = () => {
  const store = useAuthStore()

  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => store.isAuthenticated),
    userRole: computed(() => store.userRole),
    userName: computed(() => store.userName),
    token: computed(() => store.token),
    loading: computed(() => store.loading),
    login: store.login,
    register: store.register,
    logout: store.logout,
    checkAuth: store.checkAuth,
    updateUser: store.updateUser
  }
}

