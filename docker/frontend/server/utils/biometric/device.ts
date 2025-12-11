import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const verifyDevice = async (serial: string) => {
  if (!serial) throw new Error('Serial del dispositivo requerido');
  
  // CORREGIDO: biometricDevices
  const device = await prisma.biometricDevices.findUnique({
    where: { serial_number: serial }
  });

  if (!device || !device.is_active) {
    throw new Error('Dispositivo no autorizado o inactivo');
  }
  return device;
};