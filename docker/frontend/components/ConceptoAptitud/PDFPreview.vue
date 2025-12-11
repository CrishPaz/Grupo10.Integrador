<template>
  <div class="pdf-preview-modal">
    <div class="modal-overlay" @click="$emit('close')"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>Vista Previa - Concepto de Aptitud</h3>
        <button @click="$emit('close')" class="close-button">&times;</button>
      </div>
      
      <div class="modal-body">
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Generando PDF...</p>
        </div>
        
        <div v-else-if="error" class="error-container">
          <p class="error-message">{{ error }}</p>
          <button @click="retry" class="retry-button">Reintentar</button>
        </div>
        
        <iframe
          v-else
          :src="pdfUrl"
          class="pdf-viewer"
          title="Concepto de Aptitud PDF"
        ></iframe>
      </div>
      
      <div class="modal-footer">
        <button @click="downloadPDF" class="btn-download">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Descargar PDF
        </button>
        <button @click="printPDF" class="btn-print">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Imprimir
        </button>
        <button @click="sendEmail" class="btn-email">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          Enviar por Email
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  pdfData: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);

const loading = ref(false);
const error = ref('');

const pdfUrl = computed(() => {
  return `data:application/pdf;base64,${props.pdfData}`;
});

function downloadPDF() {
  const link = document.createElement('a');
  link.href = pdfUrl.value;
  link.download = `concepto_aptitud_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function printPDF() {
  const printWindow = window.open(pdfUrl.value);
  if (printWindow) {
    printWindow.onload = function() {
      printWindow.print();
    };
  }
}

async function sendEmail() {
  try {
    // Implementar envío de email con PDF adjunto
    alert('Funcionalidad de envío por email en desarrollo');
  } catch (err) {
    console.error('Error enviando email:', err);
    error.value = 'Error al enviar el email';
  }
}

function retry() {
  // Reintentar generación de PDF
  loading.value = true;
  error.value = '';
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}
</script>

<style scoped>
.pdf-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 1000px;
  height: 90vh;
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  z-index: 10000;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.close-button {
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
}

.close-button:hover {
  color: #475569;
}

.modal-body {
  flex: 1;
  padding: 0;
  overflow: hidden;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  color: #ef4444;
  margin-bottom: 16px;
}

.retry-button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: none;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.modal-footer button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-download {
  background: #10b981;
  color: white;
}

.btn-download:hover {
  background: #059669;
}

.btn-print {
  background: #f59e0b;
  color: white;
}

.btn-print:hover {
  background: #d97706;
}

.btn-email {
  background: #8b5cf6;
  color: white;
}

.btn-email:hover {
  background: #7c3aed;
}
</style>
