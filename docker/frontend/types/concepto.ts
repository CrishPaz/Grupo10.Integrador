export interface PlantillaConcepto {
  id: string;
  nombre: string;
  tipo_resultado: string[];
  contenido_html: string;
  variables_disponibles?: any;
  is_activa: boolean;
}

export interface ConceptoAptitud {
  id: string;
  admision_id: string;
  resultado: string; // 'apto', 'no_apto', etc.
  restricciones?: string | null;
  recomendaciones?: string | null;
  fecha_vigencia?: string | null;
  fecha_emision: string;
  firmado_por?: string | null;
  hash_documento?: string | null;
  pdf_generado?: any; // Base64 o Buffer
  
  // Relaciones opcionales para cuando traemos datos completos
  medico?: {
    nombres: string;
    apellidos: string;
    colegiatura?: string;
  };
  admision?: {
    paciente?: {
      nombres: string;
      apellidos: string;
      dni: string;
    };
    empresa?: {
      razon_social: string;
    };
  };
}