<template>
  <div class="landing-container">
    <!-- Animated Medical Background -->
    <div class="medical-background">
      <div class="gradient-overlay"></div>
      <div class="medical-pattern">
        <div class="pattern-grid"></div>
        <div class="floating-particles">
          <div class="particle" v-for="i in 15" :key="i"></div>
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <main class="hero-section">
      <div class="content-wrapper">
        <!-- Logo Icon - Fade In -->
        <div class="logo-container fade-in" style="animation-delay: 0.2s">
          <div class="logo-icon">
            <!-- Medical Cross -->
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3z"/>
            </svg>
          </div>
        </div>

        <!-- Main Title - Fade In -->
        <h1 class="main-title fade-in" style="animation-delay: 0.4s">
          Sistema Inteligente de 
          <span class="gradient-text">Salud Laboral</span>
        </h1>

        <!-- Subtitle - Fade In -->
        <p class="subtitle fade-in" style="animation-delay: 0.6s">
          Plataforma integral para la gestión de salud ocupacional en Perú.<br/>
          Cumplimiento riguroso de la <strong>Ley N° 29783</strong>.
        </p>

        <!-- Features Grid - Fade In -->
        <div class="features-grid fade-in" style="animation-delay: 0.8s">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Cumplimiento Legal</h3>
            <p>Conforme a normativas peruanas de salud ocupacional</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>Seguridad Avanzada</h3>
            <p>Protección de datos con encriptación de última generación</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <h3>Monitoreo en Tiempo Real</h3>
            <p>Seguimiento continuo del estado de salud laboral</p>
          </div>
        </div>

        <!-- CTA Button - Fade In with Scale -->
        <div class="cta-section fade-in-scale" style="animation-delay: 1s">
          <NuxtLink to="/login" class="cta-button">
            <span>Iniciar Sesión</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </NuxtLink>
          <p class="cta-subtitle">Accede a tu cuenta y gestiona tu salud ocupacional</p>
        </div>

        <!-- Stats Section - Fade In -->
        <div class="stats-section fade-in" style="animation-delay: 1.2s">
          <div class="stat-item">
            <div class="stat-number">1000+</div>
            <div class="stat-label">Usuarios Activos</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">99.9%</div>
            <div class="stat-label">Uptime Garantizado</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Soporte Técnico</div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer - Fade In -->
    <footer class="footer fade-in" style="animation-delay: 1.4s">
      <div class="footer-content">
        <svg class="shield-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <p>&copy; {{ new Date().getFullYear() }} Sistema de Salud Laboral Perú. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

// Optional: Add some interactive behavior
const stats = ref([
  { number: '1000+', label: 'Usuarios Activos' },
  { number: '99.9%', label: 'Uptime Garantizado' },
  { number: '24/7', label: 'Soporte Técnico' }
])
</script>

<style scoped>
.landing-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Medical Background */
.medical-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
}

.dark .medical-background {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%);
}

.gradient-overlay {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(118, 75, 162, 0.2) 0%, transparent 50%);
}

.medical-pattern {
  position: absolute;
  inset: 0;
}

.pattern-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 30s linear infinite;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(40px, 40px); }
}

.floating-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particleFloat 15s ease-in-out infinite;
}

.particle:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; top: 40%; animation-delay: 1s; }
.particle:nth-child(3) { left: 30%; top: 60%; animation-delay: 2s; }
.particle:nth-child(4) { left: 40%; top: 80%; animation-delay: 3s; }
.particle:nth-child(5) { left: 50%; top: 30%; animation-delay: 4s; }
.particle:nth-child(6) { left: 60%; top: 50%; animation-delay: 5s; }
.particle:nth-child(7) { left: 70%; top: 70%; animation-delay: 6s; }
.particle:nth-child(8) { left: 80%; top: 20%; animation-delay: 7s; }
.particle:nth-child(9) { left: 90%; top: 40%; animation-delay: 8s; }
.particle:nth-child(10) { left: 15%; top: 70%; animation-delay: 9s; }
.particle:nth-child(11) { left: 25%; top: 10%; animation-delay: 10s; }
.particle:nth-child(12) { left: 35%; top: 90%; animation-delay: 11s; }
.particle:nth-child(13) { left: 65%; top: 15%; animation-delay: 12s; }
.particle:nth-child(14) { left: 75%; top: 85%; animation-delay: 13s; }
.particle:nth-child(15) { left: 85%; top: 55%; animation-delay: 14s; }

@keyframes particleFloat {
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
  10%, 90% { opacity: 1; }
  50% { transform: translateY(-100px) translateX(50px); }
}

/* Hero Section */
.hero-section {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  z-index: 1;
}

.content-wrapper {
  max-width: 1200px;
  width: 100%;
  text-align: center;
}

/* Fade Animations */
.fade-in {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.fade-in-scale {
  animation: fadeInScale 1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Logo */
.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.logo-icon {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.3);
  animation: logoFloat 3s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.logo-icon svg {
  width: 50px;
  height: 50px;
  stroke-width: 2;
}

/* Main Title */
.main-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dark .main-title {
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.gradient-text {
  background: linear-gradient(135deg, #fff, #f0f9ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.3rem);
  color: rgba(255, 255, 255, 0.95);
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.7;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .feature-card {
  background: rgba(30, 41, 59, 0.9);
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
}

.feature-icon svg {
  width: 30px;
  height: 30px;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.75rem;
}

.dark .feature-card h3 {
  color: #f1f5f9;
}

.feature-card p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
}

.dark .feature-card p {
  color: #94a3b8;
}

/* CTA Section */
.cta-section {
  margin: 3rem auto;
  max-width: 600px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 3rem;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 16px;
  text-decoration: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .cta-button {
  background: rgba(30, 41, 59, 0.95);
  color: #818cf8;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.cta-button:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.2);
  background: white;
}

.dark .cta-button:hover {
  background: rgba(51, 65, 85, 0.95);
  box-shadow: 0 15px 60px rgba(0, 0, 0, 0.5);
}

.arrow-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.cta-button:hover .arrow-icon {
  transform: translateX(4px);
}

.cta-subtitle {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

/* Stats Section */
.stats-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  margin-top: 4rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.5rem;
}

.stat-divider {
  width: 1px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
}

/* Footer */
.footer {
  position: relative;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.shield-icon {
  width: 18px;
  height: 18px;
  color: #a5f3fc;
}

/* Responsive */
@media (max-width: 768px) {
  .features-grid {
    gap: 1.5rem;
  }
  
  .stats-section {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .stat-divider {
    width: 100px;
    height: 1px;
  }
  
  .cta-button {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}
</style>