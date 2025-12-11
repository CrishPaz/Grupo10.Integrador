<template>
  <div class="fingerprint-capture">
    <div class="relative">
      <canvas 
        ref="canvas"
        class="border rounded-lg bg-gray-900 w-full"
        :width="canvasWidth"
        :height="canvasHeight"
      ></canvas>
      
      <div v-if="captureState !== 'idle'" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
        <div class="text-center text-white">
          <div class="text-4xl mb-2 flex justify-center">
             <FingerPrintIcon v-if="captureState === 'capturing'" class="h-16 w-16 animate-pulse text-blue-400" />
            <ArrowPathIcon v-else-if="captureState === 'processing'" class="h-16 w-16 animate-spin text-yellow-400" />
            <CheckCircleIcon v-else-if="captureState === 'success'" class="h-16 w-16 text-green-400" />
            <ExclamationCircleIcon v-else class="h-16 w-16 text-red-400" />
          </div>
          <p class="font-medium">{{ statusMessage }}</p>
        </div>
      </div>
    </div>
    
    <div class="mt-4 flex flex-col items-center">
      <button 
        @click="startCapture"
        :disabled="captureState !== 'idle'"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 w-full"
      >
        {{ captureState === 'idle' ? 'Iniciar Captura' : 'Capturando...' }}
      </button>
      
      <div v-if="quality > 0" class="mt-4 w-full">
        <div class="flex justify-between text-sm mb-1">
          <span>Calidad de la muestra</span>
          <span :class="quality >= 70 ? 'text-green-600' : 'text-yellow-600'">
           {{ quality }}%
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all"
            :class="quality >= 70 ? 'bg-green-600' : quality >= 50 ? 'bg-yellow-600' : 'bg-red-600'"
            :style="{ width: `${quality}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// Importamos los iconos que ya tienes instalados en el proyecto
import { FingerPrintIcon, ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  deviceId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['capture', 'quality']);

// Estado
const canvas = ref<HTMLCanvasElement>();
const canvasWidth = 300;
const canvasHeight = 400;
const captureState = ref<'idle' | 'capturing' | 'processing' | 'success' | 'error'>('idle');
const quality = ref(0);
const capturedTemplate = ref<string>('');
const statusMessage = ref('Listo para capturar huella');

// Métodos
async function startCapture() {
  if (captureState.value !== 'idle') return;
  
  captureState.value = 'capturing';
  statusMessage.value = 'Coloque su dedo en el lector...';
  
  try {
    // 1. Inicializar dispositivo
    await initializeDevice();
    
    // 2. Capturar huella
    const fingerprintData = await captureFingerprint();
    
    // 3. Procesar
    captureState.value = 'processing';
    statusMessage.value = 'Procesando huella...';
    
    const processed = await processFingerprint(fingerprintData);
    
    // 4. Evaluar calidad
    quality.value = evaluateQuality(processed);
    
    if (quality.value >= 60) {
      capturedTemplate.value = processed.template;
      captureState.value = 'success';
      statusMessage.value = '¡Huella capturada exitosamente!';
      
      emit('capture', {
        template: capturedTemplate.value,
        quality: quality.value
      });
      
      emit('quality', quality.value);
      
      // Reset después de 2 segundos
      setTimeout(resetCapture, 2000);
      
    } else {
      captureState.value = 'error';
      statusMessage.value = 'Calidad insuficiente. Intente nuevamente.';
      
      setTimeout(() => {
        resetCapture();
      }, 3000);
    }
    
  } catch (error: any) {
    console.error('Error capturando huella:', error);
    captureState.value = 'error';
    statusMessage.value = 'Error: ' + error.message;
    
    setTimeout(() => {
      resetCapture();
    }, 3000);
  }
}

async function initializeDevice(): Promise<void> {
  // Simulación de dispositivo
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% éxito simulado
        resolve();
      } else {
        reject(new Error('Dispositivo no disponible'));
      }
    }, 500);
  });
}

async function captureFingerprint(): Promise<ArrayBuffer> {
  // Simular captura de huella
  return new Promise((resolve) => {
    setTimeout(() => {
      const buffer = new ArrayBuffer(512);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < view.length; i++) {
        view[i] = Math.floor(Math.random() * 256);
      }
      resolve(buffer);
      
      // Dibujar en canvas
      drawFingerprintSimulation();
    }, 1500);
  });
}

async function processFingerprint(data: ArrayBuffer): Promise<{
  template: string;
  image: ImageData;
  features: number;
}> {
  // Simular procesamiento
  return new Promise((resolve) => {
    setTimeout(() => {
      // Usar API del navegador para Base64 en lugar de Buffer (Node.js)
      let binary = '';
      const bytes = new Uint8Array(data);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const template = btoa(binary);
      // Hack simple para ImageData en entorno SSR/Node
      let imageData;
      try {
          const ctx = canvas.value?.getContext('2d');
          imageData = ctx?.getImageData(0, 0, canvasWidth, canvasHeight);
      } catch(e) {}
      
      resolve({
        template,
        image: imageData as ImageData,
        features: Math.floor(Math.random() * 50) + 30
      });
    }, 1000);
  });
}

function evaluateQuality(processed: any): number {
  let score = processed.features * 2; 
  const noise = Math.random() * 20;
  score -= noise;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function drawFingerprintSimulation() {
  const ctx = canvas.value?.getContext('2d');
  if (!ctx) return;
  
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  
  // Dibujo simulado de huellas
  for (let i = 0; i < 15; i++) {
    const y = 50 + i * 20;
    ctx.beginPath();
    for (let x = 20; x < canvasWidth - 20; x += 2) {
      const amplitude = 10 + Math.sin(x * 0.05 + i * 0.5) * 8;
      const noise = Math.random() * 4 - 2;
      const pointY = y + amplitude + noise;
      if (x === 20) ctx.moveTo(x, pointY);
      else ctx.lineTo(x, pointY);
    }
    ctx.stroke();
  }
}

function resetCapture() {
  captureState.value = 'idle';
  statusMessage.value = 'Listo para capturar huella';
  quality.value = 0;
  capturedTemplate.value = '';
  
  const ctx = canvas.value?.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
}

onMounted(() => {
  drawFingerprintSimulation();
});
</script>