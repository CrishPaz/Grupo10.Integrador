import { defineEventHandler } from 'h3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Middleware para auditar acciones del módulo de aptitud
  
  const originalUrl = event.node.req.url;
  
  if (originalUrl?.includes('/api/medical/aptitude')) { // Ajustado a la ruta real que creamos
    const user = event.context.user;
    const method = event.node.req.method;
    
    // Registrar en auditoría después de la respuesta
    event.node.res.on('finish', async () => {
      // Solo registramos si hubo un usuario (para evitar errores en llamadas públicas)
      if (user?.id) {
          try {
            await prisma.auditoriaConceptos.create({
              data: {
                accion: method || 'UNKNOWN',
                usuario_id: user.id,
                concepto_id: null, // No siempre tenemos el ID aquí, pero registramos el intento
                detalles: {
                  url: originalUrl,
                  method,
                  statusCode: event.node.res.statusCode,
                  timestamp: new Date().toISOString()
                },
                ip_address: event.node.req.socket.remoteAddress,
                user_agent: event.node.req.headers['user-agent']
              }
            });
          } catch (error) {
            console.error('Error registrando auditoría:', error);
          }
      }
    });
  }
});