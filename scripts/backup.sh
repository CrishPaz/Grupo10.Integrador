#!/bin/bash

# Script de backup para Sistema de Salud Laboral

set -e

echo "💾 Iniciando backup del Sistema de Salud Laboral"

# Variables
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/$TIMESTAMP"
# Configura tu bucket real aquí o déjalo así si solo usarás backup local
S3_BUCKET="salud-laboral-backups" 

# Crear directorio de backup
mkdir -p $BACKUP_DIR

echo "📦 Creando backup de base de datos..."
# Nota: Asegúrate que el nombre del servicio en docker-compose coincida (ej: salud_db o postgres)
docker-compose exec -T salud_db pg_dump -U admin_salud --format=custom salud_laboral > $BACKUP_DIR/db_backup.dump

# Nota: Si tienes carpetas de uploads, descomenta las siguientes líneas
# echo "📁 Creando backup de uploads..."
# cp -r uploads $BACKUP_DIR/

# echo "📝 Creando backup de logs..."
# cp -r logs $BACKUP_DIR/

echo "📋 Creando archivo de metadatos..."
cat > $BACKUP_DIR/metadata.json << EOF
{
 "timestamp": "$TIMESTAMP",
 "system": "Salud Laboral",
 "version": "1.0.0",
 "database_size": "$(du -h $BACKUP_DIR/db_backup.dump | cut -f1)"
}
EOF

# Comprimir backup
echo "🗜️ Comprimiendo backup..."
tar -czf $BACKUP_DIR.tar.gz -C backups $TIMESTAMP

# Subir a S3 (si está configurado y tienes AWS CLI instalado)
if [ -n "$AWS_ACCESS_KEY_ID" ]; then
  echo "☁️ Subiendo backup a S3..."
  # aws s3 cp $BACKUP_DIR.tar.gz s3://$S3_BUCKET/$TIMESTAMP.tar.gz
  echo "Simulación: Backup subido a S3"
fi

# Limpiar backups antiguos (mantener últimos 7 días)
echo "🧹 Limpiando backups antiguos locales..."
# find backups -type d -name "202*" -mtime +7 -exec rm -rf {} \;
# find backups -type f -name "*.tar.gz" -mtime +7 -delete

echo "✅ Backup completado exitosamente en: $BACKUP_DIR.tar.gz"