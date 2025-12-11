import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    // Le decimos explícitamente: "Busca archivos .spec.ts dentro de la carpeta tests"
    include: ['tests/**/*.spec.ts'],
    environment: 'node',
    globals: true
  }
})