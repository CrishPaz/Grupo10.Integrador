import axios from 'axios';
import { xml2js, js2xml } from 'xml-js';
import * as crypto from 'crypto';
// import fs from 'fs'; // Comentado para evitar errores si no hay certificados
// import path from 'path';

export interface DatosFactura {
  emisor: {
    ruc: string;
    razon_social: string;
    direccion: string;
    ubigeo: string;
    provincia: string;
    distrito: string;
  };
  receptor: {
    tipo_documento: string;
    numero_documento: string;
    razon_social: string;
    direccion: string;
  };
  factura: {
    tipo: string;
    serie: string;
    numero: number;
    fecha_emision: Date;
    moneda: string;
    items: Array<any>;
    subtotal: number;
    descuento: number;
    igv: number;
    total: number;
  };
}

export interface RespuestaSUNAT {
  aceptado: boolean;
  mensaje: string;
  cdr?: string;
  hash?: string;
  errores?: Array<{ codigo: string; mensaje: string }>;
}

export class SUNATClient {
  private readonly baseURL: string;
  
  constructor() {
    // Usamos URL de prueba por defecto
    this.baseURL = process.env.SUNAT_URL || 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService';
  }
  
  /**
   * Genera el XML para una factura electrónica (Simulado)
   */
  async generarXMLFactura(datos: any): Promise<string> {
    // Aquí iría la lógica compleja de UBL 2.1
    // Para simplificar y que funcione rápido, devolvemos un XML básico válido
    const xmlTemplate = {
      _declaration: { _attributes: { version: '1.0', encoding: 'ISO-8859-1' } },
      'Invoice': {
        _attributes: { xmlns: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2' },
        'cbc:ID': `${datos.serie}-${datos.numero}`,
        'cbc:IssueDate': new Date().toISOString().split('T')[0],
        'cac:AccountingCustomerParty': {
            'cac:Party': {
                'cac:PartyName': { 'cbc:Name': datos.receptor_razon_social }
            }
        },
        'cac:LegalMonetaryTotal': {
            'cbc:PayableAmount': datos.total
        }
      }
    };
    
    return js2xml(xmlTemplate, { compact: true, spaces: 2 });
  }
  
  /**
   * Firma digitalmente un XML (Simulado)
   */
  async firmarXML(xml: string): Promise<string> {
    // En producción usaríamos certificados reales (.pfx)
    // Aquí simulamos la firma agregando un hash
    const hash = crypto.createHash('sha256').update(xml).digest('hex');
    
    // Devolvemos el mismo XML pero "marcado" como firmado
    return xml + `\n`;
  }
  
  /**
   * Envía comprobante a SUNAT (Simulado)
   */
  async enviarComprobante(xmlFirmado: string, tipo: string, serie: string, numero: number): Promise<RespuestaSUNAT> {
    // Simulamos una respuesta exitosa de SUNAT después de 1 segundo
    await new Promise(resolve => setTimeout(resolve, 1000));

    const esExitoso = true; // Cambiar a Math.random() > 0.1 para probar fallos

    if (esExitoso) {
        return {
            aceptado: true,
            mensaje: `El comprobante ${serie}-${numero} ha sido aceptado`,
            cdr: 'CDR_SIMULADO_BASE64',
            hash: 'HASH_CDR_SIMULADO'
        };
    } else {
        return {
            aceptado: false,
            mensaje: 'Error de validación en SUNAT (Simulado)',
            errores: [{ codigo: '2000', mensaje: 'RUC inválido' }]
        };
    }
  }

  async consultarCDR(ruc: string, tipo: string, serie: string, numero: number): Promise<RespuestaSUNAT> {
      return { aceptado: true, mensaje: 'Comprobante existe (Simulado)' };
  }
}

// Exportar funciones de utilidad para usar en las APIs
export const generarXMLFactura = async (datos: any): Promise<string> => {
  const client = new SUNATClient();
  return client.generarXMLFactura(datos);
};

export const firmarXML = async (xml: string): Promise<string> => {
  const client = new SUNATClient();
  return client.firmarXML(xml);
};

export const enviarComprobanteSUNAT = async (xml: string, tipo: string, serie: string, numero: number): Promise<RespuestaSUNAT> => {
  const client = new SUNATClient();
  return client.enviarComprobante(xml, tipo, serie, numero);
};

export const consultarCDR = async (ruc: string, tipo: string, serie: string, numero: number): Promise<RespuestaSUNAT> => {
  const client = new SUNATClient();
  return client.consultarCDR(ruc, tipo, serie, numero);
};