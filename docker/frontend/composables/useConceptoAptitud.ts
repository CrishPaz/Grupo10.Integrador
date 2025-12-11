import { ref, computed } from 'vue';
import type { ConceptoAptitud, PlantillaConcepto } from '~/types/concepto';

export const useConceptoAptitud = () => {
  const conceptos = ref<ConceptoAptitud[]>([]);
  const currentConcepto = ref<ConceptoAptitud | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Obtener conceptos por paciente
  const fetchConceptosByPaciente = async (pacienteId: string) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Nota: Asegúrate de crear este endpoint en el backend si lo vas a usar
      const response: any = await $fetch(`/api/concepto-aptitud/paciente/${pacienteId}`);
      conceptos.value = response.data || response; // Adaptamos según venga la respuesta
    } catch (err: any) {
      error.value = err.message || 'Error al cargar conceptos';
      console.error('Error fetching conceptos:', err);
    } finally {
      loading.value = false;
    }
  };

  // Obtener concepto por ID
  const fetchConceptoById = async (conceptoId: string) => {
    loading.value = true;
    
    try {
      const response: any = await $fetch(`/api/concepto-aptitud/${conceptoId}`);
      currentConcepto.value = response.data || response;
    } catch (err: any) {
      error.value = err.message || 'Error al cargar concepto';
      console.error('Error fetching concepto:', err);
    } finally {
      loading.value = false;
    }
  };

  // Validar requisitos para crear concepto
  const validateConceptoRequirements = async (admisionId: string) => {
    try {
      // Nota: Este endpoint debe existir en el backend
      const response: any = await $fetch(`/api/concepto-aptitud/validate/${admisionId}`);
      return response.valid;
    } catch (err) {
      console.error('Error validando requisitos:', err);
      // Por defecto permitimos continuar si falla la validación estricta en desarrollo
      return true; 
    }
  };

  // Obtener plantillas disponibles
  const fetchPlantillas = async (): Promise<PlantillaConcepto[]> => {
    try {
      const response: any = await $fetch('/api/medical/aptitude/templates'); // Ajusté la ruta a la que creamos antes
      return response || [];
    } catch (err) {
      console.error('Error cargando plantillas:', err);
      return [];
    }
  };

  // Generar PDF
  const generatePDF = async (conceptoId: string, plantillaId?: string) => {
    try {
      const response: any = await $fetch('/api/medical/aptitude/generate-pdf', { // Ajusté la ruta a la que creamos antes
        method: 'POST',
        body: { concepto_id: conceptoId, plantilla_id: plantillaId }
      });
      
      return {
        success: true,
        pdf: response.pdf_base64,
        hash: response.hash_verificacion
      };
    } catch (err: any) {
      console.error('Error generando PDF:', err);
      return {
        success: false,
        error: err.message
      };
    }
  };

  // Verificar integridad del concepto
  const verifyIntegrity = async (conceptoId: string) => {
    try {
      const response: any = await $fetch(`/api/concepto-aptitud/verify/${conceptoId}`);
      return response.valid;
    } catch (err) {
      console.error('Error verificando integridad:', err);
      return false;
    }
  };

  return {
    conceptos,
    currentConcepto,
    loading,
    error,
    fetchConceptosByPaciente,
    fetchConceptoById,
    validateConceptoRequirements,
    fetchPlantillas,
    generatePDF,
    verifyIntegrity
  };
};