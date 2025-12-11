import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const checkLockout = async (userId: string, deviceId: string) => {
    // Usamos SQL raw para llamar a la función que creamos en la DB
    const result: any = await prisma.$queryRaw`
        SELECT check_biometric_lockout(${userId}::uuid, ${deviceId}::uuid) as is_locked
    `;
    return result[0]?.is_locked || false;
};

export const recordFailure = async (deviceId: string, userId: string | null, reason: string) => {
    console.warn(`Fallo biométrico en dispositivo ${deviceId}: ${reason}`);
    // Aquí podrías incrementar un contador en Redis o DB
};