import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'clave_secreta_default_32_bytes_long!!';

export const decryptTemplate = (encryptedData: Buffer, iv: Buffer) => {
  const key = crypto.scryptSync(SECRET_KEY, 'salt', 32);
  // Convertimos el Buffer a hex string para el decipher
  const encryptedText = encryptedData.toString('hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return JSON.parse(decrypted);
};

export const compareTemplates = (input: any, stored: any, type: string) => {
  // Simulación: Si los datos JSON son idénticos, es un match perfecto
  // En la vida real, usaríamos un algoritmo de minutiae
  const isMatch = JSON.stringify(input) === JSON.stringify(stored);
  
  return {
    score: isMatch ? 100 : 15,
    verified: isMatch
  };
};