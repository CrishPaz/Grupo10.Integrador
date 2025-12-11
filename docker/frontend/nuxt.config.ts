// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  // Módulos
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  // Configuración de Tailwind CSS
  tailwindcss: {
    config: {
      darkMode: 'class', // Enable class-based dark mode
    }
  },

  // Transpilación para gráficos (Evita errores "document is not defined")
  build: {
    transpile: ['chart.js', 'vue-chartjs']
  },

  // Variables de Entorno (Runtime Config)
  runtimeConfig: {
    // Privadas (Solo Servidor)
    private: {
      sunatUsuarioSol: process.env.SUNAT_USUARIO_SOL,
      sunatClaveSol: process.env.SUNAT_CLAVE_SOL,
      sunatCertificadoPath: process.env.SUNAT_CERTIFICADO_PATH,
      sunatClaveCertificado: process.env.SUNAT_CLAVE_CERTIFICADO,
      culqiSecretKey: process.env.CULQI_SECRET_KEY,
      payuApiKey: process.env.PAYU_API_KEY,
      jwtSecret: process.env.JWT_SECRET,
      encryptionKey: process.env.ENCRYPTION_KEY,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: process.env.SMTP_PORT,
      smtpUser: process.env.SMTP_USER,
      smtpPass: process.env.SMTP_PASSWORD
    },
    // Públicas (Cliente y Servidor)
    public: {
      sunatUrl: process.env.SUNAT_URL,
      culqiPublicKey: process.env.CULQI_PUBLIC_KEY,
      clinicaRuc: process.env.CLINICA_RUC,
      clinicaRazonSocial: process.env.CLINICA_RAZON_SOCIAL,
      clinicaDireccion: process.env.CLINICA_DIRECCION,

      // Configuración de Analítica
      analytics: {
        cacheDuration: 300, // 5 minutos
        maxExportRows: 10000
      }
    }
  },

  app: {
    head: {
      title: 'Sistema de Salud Laboral',
      script: [
        { src: 'https://checkout.culqi.com/js/v4', defer: true }
      ]
    }
  },

  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})