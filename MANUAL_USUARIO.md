# 📘 Manual de Usuario - Sistema Inteligente de Salud Laboral

## 🎯 Índice
1. [Introducción al Sistema](#1-introducción-al-sistema)
2. [Acceso y Primeros Pasos](#2-acceso-y-primeros-pasos)
3. [Módulo de Admisiones](#3-módulo-de-admisiones)
4. [Módulo Médico](#4-módulo-médico)
5. [Módulo de Laboratorio](#5-módulo-de-laboratorio)
6. [Módulo Biométrico](#6-módulo-biométrico)
7. [Módulo de Facturación](#7-módulo-de-facturación)
8. [Módulo de Reportes](#8-módulo-de-reportes)
9. [Administración del Sistema](#9-administración-del-sistema)
10. [Solución de Problemas](#10-solución-de-problemas)

---

## 1. Introducción al Sistema

### 1.1 ¿Qué es?
El **Sistema Inteligente de Salud Laboral** es una plataforma integral diseñada para gestionar todos los procesos de salud ocupacional en clínicas y empresas en Perú, cumpliendo rigurosamente con la **Ley N° 29783** de Seguridad y Salud en el Trabajo.



### 1.2 Características Principales
* ✅ **Gestión integral** de pacientes y empresas.
* ✅ **Historia clínica ocupacional** digital.
* ✅ **Identificación biométrica** segura.
* ✅ **Facturación electrónica** integrada con SUNAT.
* ✅ **Reportes y dashboards** en tiempo real.
* ✅ **Cumplimiento normativo** automático.

### 1.3 Roles de Usuario

| Rol | Funciones Principales | Acceso |
| :--- | :--- | :--- |
| **Administrador** | Configuración, usuarios, respaldos. | Completo |
| **Admisiones** | Registro, citas, facturación inicial. | Admisiones, Pacientes |
| **Médico** | Historia clínica, aptitud, exámenes. | Médico, Historias |
| **Laboratorio** | Registro de muestras, resultados. | Laboratorio |
| **Paciente** | Ver citas, resultados, documentos. | Portal del Paciente |

---

## 2. Acceso y Primeros Pasos

### 2.1 Acceso al Sistema
1.  Abrir navegador (Chrome, Firefox, Edge).
2.  Ingresar la URL:
    * **Desarrollo:** `http://localhost:3000`
    * **Producción:** `https://saludlaboral.pe`

![Pantalla de Login](https://via.placeholder.com/800x400?text=Pantalla+de+Login+del+Sistema)

### 2.2 Credenciales por Defecto
* **Admin:** `admin@saludlaboral.pe` / `Admin123!`
* **Médico:** `doctor@saludlaboral.pe` / `Doctor123!`
* **Admisiones:** `admissions@saludlaboral.pe` / `Admissions123!`

### 2.3 Pantalla Principal (Dashboard)
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Principal+con+M%C3%A9tricas)

El Dashboard incluye:
* **Menú lateral:** Navegación.
* **Tarjetas de métricas:** Resumen rápido.
* **Acciones rápidas:** Tareas frecuentes.

---

## 3. Módulo de Admisiones

### 3.1 Registro de Nuevo Paciente
1.  **Acceder:** Menú "Admisiones" -> "Nuevo Paciente".
2.  **Datos Personales:** DNI (8 dígitos), Nombres, Fecha Nacimiento.
3.  **Datos Laborales:** Empresa, Puesto, Área.
4.  **Documentos:** Subir DNI escaneado (PDF/JPG).
5.  **Confirmación:** El sistema genera un código único.

### 3.2 Programación de Citas
1.  Buscar paciente.
2.  Clic en "Programar Cita".
3.  Seleccionar: Tipo de Examen (Ingreso/Periódico), Fecha, Médico.
4.  **Resultado:** El sistema envía email y SMS al paciente.

![Calendario](https://via.placeholder.com/800x400?text=Calendario+de+Programaci%C3%B3n+de+Citas)

---

## 4. Módulo Médico

### 4.1 Consulta Médica
1.  Ingresar como Médico.
2.  En "Citas de Hoy", clic en "Iniciar Consulta".
3.  **Anamnesis:** Llenar antecedentes y síntomas.
4.  **Examen Físico:** Signos vitales y antropometría.
5.  **Diagnóstico:** CIE-10 automático.

![Examen Físico](https://via.placeholder.com/800x400?text=Formulario+de+Examen+F%C3%ADsico)

### 4.2 Concepto de Aptitud
1.  Al finalizar la historia, clic en "Generar Concepto".
2.  Seleccionar: **APTO**, **APTO CON RESTRICCIONES** o **NO APTO**.
3.  Ingresar restricciones si aplica.
4.  **Firma Digital:** Ingresar clave para firmar.

![Concepto Aptitud](https://via.placeholder.com/800x400?text=Generaci%C3%B3n+de+Concepto+de+Aptitud)

---

## 5. Módulo de Laboratorio

### 5.1 Flujo de Trabajo
1.  **Recepción:** Escanear QR de la muestra o ingresar código.
2.  **Proceso:** El sistema valida requisitos y asigna técnico.
3.  **Resultados:**
    * **Manual:** Digitar valores (el sistema alerta si están fuera de rango).
    * **Automático:** Carga masiva desde equipos o Excel.
4.  **Validación:** El bioquímico libera los resultados.

---

## 6. Módulo Biométrico

### 6.1 Registro y Check-in
* **Enrolamiento:** Captura de huella dactilar (3 repeticiones, calidad > 70%).
* **Check-in:** El paciente coloca el dedo al llegar. El sistema confirma identidad y muestra consultorio.

![Captura Huella](https://via.placeholder.com/800x400?text=Interfaz+de+Captura+de+Huella+Dactilar)

---

## 7. Módulo de Facturación

### 7.1 Emisión y SUNAT
1.  Ir a "Facturación" -> "Pendientes".
2.  Seleccionar admisiones a facturar.
3.  El sistema genera Factura (RUC) o Boleta (DNI).
4.  **Envío SUNAT:** Automático. Se recibe CDR (Aceptado/Rechazado).

![Facturación](https://via.placeholder.com/800x400?text=Formulario+de+Facturaci%C3%B3n+Electr%C3%B3nica)

---

## 8. Módulo de Reportes

### 8.1 Inteligencia de Negocios
* **Operativo:** Exámenes por mes, pacientes atendidos.
* **Financiero:** Ingresos por empresa, facturación diaria.
* **Legal:** Reporte de Incidencias (Ley 29783).
* **Exportación:** Todo descargable en Excel y PDF.

---

## 9. Administración del Sistema

### 9.1 Seguridad y Configuración
* **Usuarios:** Crear usuarios y asignar roles (RBAC).
* **Backups:** Configurar copias de seguridad automáticas (S3/Local).
* **Auditoría:** Ver logs de quién hizo qué y cuándo.

---

## 10. Solución de Problemas

| Problema | Solución |
| :--- | :--- |
| **No puedo iniciar sesión** | Verificar credenciales, internet y si el usuario está activo. |
| **Error al enviar a SUNAT** | Verificar conexión y vigencia del certificado digital. |
| **Lector biométrico no responde** | Reconectar USB, limpiar sensor, verificar drivers. |

**Soporte Técnico:**
* Email: `soporte@saludlaboral.pe`
* Teléfono: `+51 1 234 5678`

---
© 2025 Sistema Inteligente de Salud Laboral - Perú