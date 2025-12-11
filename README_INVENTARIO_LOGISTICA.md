# Módulo de Inventario y Logística - Documentación Técnica

## Descripción
Módulo completo para la gestión de inventario de insumos médicos y seguimiento 
logístico de servicios en una clínica de salud ocupacional.

## Características Principales

### 1. Gestión de Inventario
- **Control completo de stock**: Entradas, salidas, ajustes, traslados
- **Gestión de caducidad**: Alertas automáticas por vencimiento
- **Valorización**: Kardex con métodos PEPS, UEPS y promedio
- **Códigos de barras/QR**: Identificación única de ítems
- **Ubicación física**: Control por estante, nivel y posición
- **Múltiples categorías**: Medicamentos, material de laboratorio, instrumental, etc.

### 2. Alertas Inteligentes
- **Stock bajo/crítico**: Basado en puntos de reorden
- **Caducidad próxima**: Alertas por productos por vencer
- **Sin movimiento**: Ítems sin movimiento en período definido
- **Notificaciones multi-canal**: Email, SMS, WhatsApp
- **Niveles de gravedad**: Crítico, alto, medio, bajo

### 3. Seguimiento Logístico
- **Estados predefinidos**: Desde "Programado" hasta "Entregado"
- **Timeline visual**: Historial completo de estados
- **Monitoreo en tiempo real**: Actualizaciones automáticas
- **Alertas de retraso**: Notificaciones por tiempos excedidos
- **Responsables asignados**: Seguimiento por personal específico

### 4. Integración con otros módulos
- **Facturación**: Salidas automáticas por servicios
- **Admisiones**: Seguimiento por paciente/admisión
- **Laboratorio**: Gestión de muestras y resultados
- **Compras**: Solicitudes automáticas de reposición

## Arquitectura Técnica

### Base de Datos
```sql
-- Tablas principales
inventario_items/          # Ítems de inventario
movimientos_inventario/    # Entradas/salidas
seguimiento_logistico/     # Seguimiento de servicios
historial_estados_logistica/ # Timeline de estados
alertas_inventario/        # Alertas del sistema
kardex/                    # Valorización de inventario
proveedores/               # Catálogo de proveedores
