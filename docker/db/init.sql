-- Tablas principales del sistema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios del sistema (incluye todos los roles)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dni VARCHAR(8) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('admin', 'admissions', 'doctor', 'lab', 'patient')),
    especialidad VARCHAR(100),
    colegiatura VARCHAR(20),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true,
    huella_dactilar BYTEA, -- Almacenamiento seguro de template biométrico
    CONSTRAINT chk_dni_length CHECK (LENGTH(dni) = 8)
);

CREATE INDEX idx_usuarios_dni ON usuarios(dni);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- Tabla de empresas/clientes
CREATE TABLE empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ruc VARCHAR(11) UNIQUE NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_comercial VARCHAR(255),
    direccion TEXT,
    telefono VARCHAR(15),
    contacto_nombre VARCHAR(100),
    contacto_email VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pacientes/trabajadores
CREATE TABLE pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID UNIQUE REFERENCES usuarios(id),
    empresa_id UUID REFERENCES empresas(id),
    tipo_sangre VARCHAR(3),
    alergias TEXT,
    medicamentos_actuales TEXT,
    antecedentes_familiares TEXT,
    antecedentes_laborales JSONB, -- JSON con historial de puestos y riesgos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pacientes_usuario ON pacientes(usuario_id);
CREATE INDEX idx_pacientes_empresa ON pacientes(empresa_id);

-- Tabla de admisiones (citas/consultas)
CREATE TABLE admisiones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id),
    empresa_id UUID REFERENCES empresas(id),
    tipo_examen VARCHAR(50) NOT NULL, -- 'ingreso', 'periodico', 'retiro', 'reintegro'
    estado VARCHAR(20) DEFAULT 'programado' CHECK (estado IN ('programado', 'confirmado', 'en_proceso', 'completado', 'cancelado')),
    fecha_programada TIMESTAMP NOT NULL,
    fecha_atencion TIMESTAMP,
    medico_id UUID REFERENCES usuarios(id),
    motivo_consulta TEXT,
    observaciones_admision TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES usuarios(id)
);

CREATE INDEX idx_admisiones_paciente ON admisiones(paciente_id);
CREATE INDEX idx_admisiones_fecha ON admisiones(fecha_programada);
CREATE INDEX idx_admisiones_estado ON admisiones(estado);

-- Tabla de historia clínica (una por admisión)
CREATE TABLE historia_clinica (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admision_id UUID UNIQUE REFERENCES admisiones(id),
    anamnesis TEXT,
    examen_fisico JSONB, -- JSON estructurado: { presion_arterial: "120/80", peso: 70, ... }
    diagnostico TEXT,
    tratamiento TEXT,
    notas_evolucion TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES usuarios(id)
);

-- Tabla de exámenes de laboratorio
CREATE TABLE examenes_laboratorio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admision_id UUID REFERENCES admisiones(id),
    tipo_examen VARCHAR(100) NOT NULL, -- 'hematologia', 'orina', 'audiometria', etc.
    parametros JSONB NOT NULL, -- JSON con valores normales y resultados
    resultado_final TEXT,
    archivo_resultado BYTEA, -- PDF/Imagen del resultado
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesando', 'completado', 'anulado')),
    fecha_muestra TIMESTAMP,
    fecha_resultado TIMESTAMP,
    tecnico_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_examenes_admision ON examenes_laboratorio(admision_id);
CREATE INDEX idx_examenes_tipo ON examenes_laboratorio(tipo_examen);

-- Tabla de conceptos de aptitud
CREATE TABLE conceptos_aptitud (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admision_id UUID UNIQUE REFERENCES admisiones(id),
    resultado VARCHAR(20) NOT NULL CHECK (resultado IN ('apto', 'no_apto', 'apto_con_restricciones')),
    restricciones TEXT,
    recomendaciones TEXT,
    fecha_vigencia DATE,
    firma_digital BYTEA,
    pdf_generado BYTEA,
    hash_verificacion VARCHAR(64), -- SHA256 para integridad del documento
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES usuarios(id)
);

-- Tabla de facturación
CREATE TABLE facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admision_id UUID REFERENCES admisiones(id),
    numero_serie VARCHAR(4),
    numero_correlativo INTEGER,
    tipo_comprobante VARCHAR(2) CHECK (tipo_comprobante IN ('01', '03')), -- 01: Factura, 03: Boleta
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'anulado')),
    subtotal DECIMAL(10,2),
    igv DECIMAL(10,2),
    total DECIMAL(10,2),
    fecha_emision DATE DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    metodo_pago VARCHAR(50),
    transaccion_id VARCHAR(100),
    xml_sunat BYTEA,
    cdr_sunat BYTEA,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE SEQUENCE factura_correlativo_seq START 1;
CREATE INDEX idx_facturas_admision ON facturas(admision_id);

-- Tabla de inventario
CREATE TABLE inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    stock_actual INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 5,
    unidad_medida VARCHAR(20),
    precio_unitario DECIMAL(10,2),
    proveedor VARCHAR(200),
    ubicacion VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de movimientos de inventario
CREATE TABLE movimientos_inventario (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventario(id),
    tipo_movimiento VARCHAR(10) CHECK (tipo_movimiento IN ('entrada', 'salida')),
    cantidad INTEGER NOT NULL,
    motivo TEXT,
    referencia VARCHAR(100), -- N° de admisión o factura
    usuario_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Triggers para auditoría
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pacientes_updated_at BEFORE UPDATE ON pacientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventario_updated_at BEFORE UPDATE ON inventario
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- TABLAS ADICIONALES (CONFIGURACIÓN Y AUDITORÍA)
-- ==========================================

-- Tabla para configuración de la clínica
CREATE TABLE config_clinica (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(255) NOT NULL,
    ruc VARCHAR(11) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(15),
    email VARCHAR(255),
    logo BYTEA,
    logo_mime_type VARCHAR(50),
    sunat_usuario VARCHAR(100),
    sunat_password VARCHAR(500), -- Encriptado
    sunat_ambiente VARCHAR(10) DEFAULT 'beta' CHECK (sunat_ambiente IN ('beta','produccion')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para plantillas de documentos
CREATE TABLE plantillas_documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('concepto_aptitud','consentimiento','historia_clinica','factura')),
    contenido_html TEXT NOT NULL,
    variables JSONB NOT NULL, -- JSON con variables disponibles: {{paciente_nombre}}, {{fecha}}, etc.
    activa BOOLEAN DEFAULT true,
    creado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para integraciones externas
CREATE TABLE integraciones_externas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('pago','dni','biometrico','sms','email')),
    config JSONB NOT NULL, -- Configuración específica de cada integración
    activa BOOLEAN DEFAULT false,
    creado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para logs de auditoría
CREATE TABLE logs_auditoria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id),
    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(50) NOT NULL,
    detalles JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_usuario ON logs_auditoria(usuario_id);
CREATE INDEX idx_logs_modulo ON logs_auditoria(modulo);
CREATE INDEX idx_logs_fecha ON logs_auditoria(created_at);
