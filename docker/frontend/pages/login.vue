<template>
  <div class="login-container">
    <!-- Animated Medical Background -->
    <div class="medical-background">
      <div class="gradient-overlay"></div>
      <div class="medical-icons">
        <div class="icon-float icon-1">✚</div>
        <div class="icon-float icon-2">✚</div>
        <div class="icon-float icon-3">✚</div>
        <div class="icon-float icon-4">✚</div>
        <div class="icon-float icon-5">✚</div>
        <div class="icon-float icon-6">✚</div>
      </div>
      <div class="network-lines"></div>
    </div>

    <!-- Login Card with Glassmorphism -->
    <div class="login-card">
      <div class="card-header">
        <div class="logo-container">
          <div class="logo-icon">
            <!-- Medical Caduceus Symbol -->
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C11.45 2 11 2.45 11 3V21C11 21.55 11.45 22 12 22C12.55 22 13 21.55 13 21V3C13 2.45 12.55 2 12 2Z"/>
              <path d="M9 6C7.34 6 6 7.34 6 9C6 10.31 6.84 11.42 8 11.82V12.18C6.84 12.58 6 13.69 6 15C6 16.66 7.34 18 9 18C9.55 18 10 17.55 10 17C10 16.45 9.55 16 9 16C8.45 16 8 15.55 8 15C8 14.45 8.45 14 9 14C9.55 14 10 13.55 10 13C10 12.45 9.55 12 9 12C8.45 12 8 11.55 8 11C8 10.45 8.45 10 9 10C9.55 10 10 9.55 10 9C10 8.45 9.55 8 9 8C8.45 8 8 7.55 8 7C8 6.45 8.45 6 9 6Z"/>
              <path d="M15 6C16.66 6 18 7.34 18 9C18 10.31 17.16 11.42 16 11.82V12.18C17.16 12.58 18 13.69 18 15C18 16.66 16.66 18 15 18C14.45 18 14 17.55 14 17C14 16.45 14.45 16 15 16C15.55 16 16 15.55 16 15C16 14.45 15.55 14 15 14C14.45 14 14 13.55 14 13C14 12.45 14.45 12 15 12C15.55 12 16 11.55 16 11C16 10.45 15.55 10 15 10C14.45 10 14 9.55 14 9C14 8.45 14.45 8 15 8C15.55 8 16 7.55 16 7C16 6.45 15.55 6 15 6Z"/>
              <circle cx="12" cy="4" r="1.5" fill="currentColor"/>
            </svg>
          </div>
        </div>
        <h1 class="title">Sistema de Salud Laboral</h1>
        <p class="subtitle">Acceso Seguro</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <div class="input-wrapper">
             <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input 
              id="email"
              v-model="email" 
              type="email" 
              required 
              placeholder="usuario@clinica.com"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              id="password"
              v-model="password" 
              type="password" 
              required 
              placeholder="••••••••"
            />
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading">Iniciar Sesión</span>
          <span v-else class="loading-spinner">
            <svg class="animate-spin" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Ingresando...
          </span>
        </button>

        <div class="test-credentials">
          <p>🔐 Credenciales de prueba:</p>
          <code>admin@clinica.com / Admin123!</code>
        </div>
      </form>

      <div class="footer-info">
        <svg class="shield-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <p>Conexión segura • Cumplimiento Ley 29783</p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ 
  layout: false // NO sidebar ni header
})

const email = ref('admin@clinica.com')
const password = ref('')
const isLoading = ref(false)
const { login } = useAuth()
const router = useRouter()

const handleLogin = async () => {
  isLoading.value = true
  try {
    await login(email.value, password.value)
    
    setTimeout(() => {
      const user = useAuth().user.value
      if (user?.rol === 'doctor') {
        router.push('/medical')
      } else if (user?.rol === 'patient') {
        router.push('/patient')
      } else {
        router.push('/admin')
      }
    }, 500)
  } catch (error) {
    isLoading.value = false
    alert('Credenciales inválidas ❌')
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

/* Animated Medical Background */
.medical-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  animation: gradientShift 15s ease infinite;
}

.dark .medical-background {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%);
}

@keyframes gradientShift {
  0%, 100% { filter: hue-rotate(0deg); }
  50% { filter: hue-rotate(45deg); }
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(118, 75, 162, 0.3) 0%, transparent 50%);
  backdrop-filter: blur(100px);
}

.network-lines {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: networkMove 20s linear infinite;
}

@keyframes networkMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Floating Medical Icons */
.medical-icons {
  position: absolute;
  inset: 0;
}

.icon-float {
  position: absolute;
  color: rgba(255, 255, 255, 0.15);
  font-size: 4rem;
  font-weight: 100;
  animation: float 20s ease-in-out infinite;
}

.icon-1 { top: 10%; left: 10%; animation-delay: 0s; }
.icon-2 { top: 20%; right: 15%; animation-delay: 2s; }
.icon-3 { bottom: 30%; left: 20%; animation-delay: 4s; }
.icon-4 { top: 60%; right: 25%; animation-delay: 6s; }
.icon-5 { bottom: 15%; right: 10%; animation-delay: 8s; }
.icon-6 { top: 40%; left: 5%; animation-delay: 10s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
  50% { transform: translateY(-30px) rotate(180deg); opacity: 0.2; }
}

/* Glassmorphism Login Card */
.login-card {
  position: relative;
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  animation: cardFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center;
}

.dark .login-card {
  background: rgba(30, 41, 59, 0.95);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.card-header {
  text-align: center;
  margin-bottom: 2.5rem;
  animation: fadeInDown 1s ease 0.3s both;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); box-shadow: 0 15px 60px rgba(102, 126, 234, 0.6); }
}

.logo-icon svg {
  width: 36px;
  height: 36px;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.dark .title {
  color: #f1f5f9;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
}

.dark .subtitle {
  color: #94a3b8;
}

/* Form Styles */
.login-form {
  animation: fadeIn 1s ease 0.5s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.dark .form-group label {
  color: #cbd5e1;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.dark .input-wrapper input {
  background: rgba(15, 23, 42, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
}

.dark .input-wrapper input::placeholder {
  color: #64748b;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.dark .input-wrapper input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.2);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner svg {
  width: 20px;
  height: 20px;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.test-credentials {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  border-radius: 10px;
  text-align: center;
  animation: fadeIn 1s ease 0.7s both;
}

.test-credentials p {
  font-size: 0.8rem;
  color: #92400e;
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.test-credentials code {
  font-size: 0.875rem;
  color: #78350f;
  background: rgba(255, 255, 255, 0.7);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
}

.footer-info {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: fadeIn 1s ease 0.9s both;
}

.shield-icon {
  width: 16px;
  height: 16px;
  color: #10b981;
}

.footer-info p {
  font-size: 0.8rem;
  color: #6b7280;
}

.dark .footer-info p {
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 640px) {
  .login-card {
    padding: 2rem 1.5rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .medical-icons .icon-float {
    font-size: 2.5rem;
  }
}
</style>