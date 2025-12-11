#!/bin/bash

echo "🚀 Iniciando servicios..."
docker-compose up -d

echo "🔄 Aplicando migraciones de base de datos..."
sleep 10  # Esperar a que PostgreSQL esté listo
npx prisma migrate deploy

echo "✅ Despliegue completado exitosamente!"

# Verificar estado de los servicios
echo "📊 Estado de los servicios:"
docker-compose ps

# Mostrar logs recientes
echo "📝 Logs recientes:"
docker-compose logs --tail=20