import { describe, it, expect } from 'vitest';
import { encryptTemplate, hashTemplate } from '../server/utils/biometric/crypto';
import { validateBiometricQuality } from '../server/utils/biometric/quality';
import { compareTemplates } from '../server/utils/biometric/matching';
import * as crypto from 'crypto';

// Simulamos entorno
process.env.ENCRYPTION_KEY = 'clave_secreta_default_32_bytes_long!!';

describe('Módulo Biométrico', () => {
  const testTemplate = { data: 'huella-digital-simulada-12345' };

  describe('Cifrado/Descifrado (Simulado)', () => {
    it('debe generar hash consistente', () => {
      const hash1 = hashTemplate(testTemplate);
      const hash2 = hashTemplate(testTemplate);
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 hex
    });

    it('debe encriptar datos sin error', () => {
        const iv = crypto.randomBytes(16);
        const encrypted = encryptTemplate(testTemplate, iv);
        expect(encrypted).toBeDefined();
        expect(Buffer.isBuffer(encrypted)).toBe(true);
    });
  });

  describe('Comparación Biométrica', () => {
    it('debe comparar templates idénticos', () => {
      const result = compareTemplates(testTemplate, testTemplate, 'huella_dactilar');
      expect(result.score).toBe(100);
      expect(result.verified).toBe(true);
    });

    it('debe rechazar templates diferentes', () => {
      const otherTemplate = { data: 'otra-huella' };
      const result = compareTemplates(testTemplate, otherTemplate, 'huella_dactilar');
      expect(result.score).toBeLessThan(50);
      expect(result.verified).toBe(false);
    });
  });

  describe('Control de Calidad', () => {
    it('debe aceptar templates con buena calidad', () => {
      const result = validateBiometricQuality('huella_dactilar', { data: 'ok' }, 85);
      expect(result.passed).toBe(true);
    });

    it('debe rechazar templates sin datos', () => {
      const result = validateBiometricQuality('huella_dactilar', {}, 0);
      expect(result.passed).toBe(false);
    });
  });
});