import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'clave_secreta_default_32_bytes_long!!'; // Debe ser de 32 caracteres

export const generateIV = () => crypto.randomBytes(16);

export const encryptTemplate = (data: any, iv: Buffer) => {
  // Aseguramos que la clave tenga el largo correcto
  const key = crypto.scryptSync(SECRET_KEY, 'salt', 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  // Convertimos el objeto JSON a string
  const json = JSON.stringify(data);
  let encrypted = cipher.update(json, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Devolvemos el buffer encriptado
  return Buffer.from(encrypted, 'hex');
};

export const hashTemplate = (data: any) => {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};