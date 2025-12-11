# Módulo de Identificación Biométrica - Manual de Operación y Seguridad

## 1. Manual de Operación

### Procedimiento de Registro Biométrico (Enrolamiento)

**A. Preparación del Dispositivo:**
1. Conectar lector biométrico vía USB.
2. Verificar que el LED parpadee en azul (indicando "Listo").
3. Confirmar conexión en el panel administrativo (`/biometric/status`).

**B. Registro del Paciente:**
1. Buscar paciente por DNI o nombre en la interfaz.
2. Seleccionar tipo biométrico (Huella Dactilar o Reconocimiento Facial).
3. Guiar al paciente: *"Coloque el dedo índice firmemente"*.
4. Verificar que el indicador de calidad supere el **70%**.
5. Confirmar el mensaje de "Registro Exitoso".

**C. Verificación / Check-in:**
1. El paciente se acerca al kiosco.
2. Coloca el dedo en el lector o mira a la cámara.
3. El sistema busca coincidencia en **< 2 segundos**.
4. **Si coincide:** Muestra "Bienvenido" y la información de la cita.
5. **Si no coincide:** Ofrece hasta 3 intentos antes de sugerir ingreso manual por DNI.

---

### Mantenimiento Preventivo

| Frecuencia | Acciones Requeridas |
| :--- | :--- |
| **Diario** | • Limpiar superficie del lector con alcohol isopropílico.<br>• Verificar conexión física de dispositivos.<br>• Revisar logs de errores en Dashboard. |
| **Semanal** | • Actualizar drivers/firmware si hay notificaciones.<br>• Rotar claves de sesión (automático).<br>• Revisar estadísticas de falsos rechazos. |
| **Mensual** | • Calibración de sensibilidad de dispositivos.<br>• Revisar políticas de retención (eliminar datos > 10 años).<br>• Auditoría de seguridad de accesos. |

---

## 2. Consideraciones de Seguridad

### Protección de Datos Biométricos
* **Encriptación en Reposo:** AES-256-GCM para todos los templates almacenados en la base de datos.
* **Transmisión Segura:** TLS 1.3 para toda comunicación entre lector, frontend y backend.
* **Almacenamiento:** Separación física (tablas distintas) entre datos personales (Nombres/DNI) y datos biométricos (Templates).
* **Control de Acceso:** Autenticación de doble factor (2FA) requerida para administradores del módulo biométrico.
* **Auditoría:** Log inmutable (`logs_auditoria`) de cada intento de acceso, registro o modificación.

### Cumplimiento Normativo (Ley 29783 - Perú)
* **Consentimiento Informado:** El sistema registra digitalmente la autorización del paciente antes de la captura.
* **Finalidad Específica:** Los datos se usan *exclusivamente* para identificación en procesos de salud ocupacional.
* **Proporcionalidad:** Solo se almacenan plantillas matemáticas (hashes), nunca la imagen real de la huella.
* **Calidad de Datos:** El sistema rechaza automáticamente muestras de baja calidad para evitar errores futuros.
* **Conservación:** Eliminación automática de datos tras el período legal (10 años) o a solicitud del titular (derechos ARCO).

---
© 2024 Clínica Salud Laboral - Documento Confidencial