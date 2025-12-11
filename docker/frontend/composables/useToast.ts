// docker/frontend/composables/useToast.ts
export const useToast = () => {
  return {
    success: (msg: string) => console.log('✅ ÉXITO:', msg),
    error: (msg: string) => console.error('❌ ERROR:', msg),
    info: (msg: string) => console.log('ℹ️ INFO:', msg),
    warning: (msg: string) => console.warn('⚠️ ALERTA:', msg)
  }
}