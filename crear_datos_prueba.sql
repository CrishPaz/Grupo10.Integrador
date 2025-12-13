-- Script para crear datos de prueba para el webhook de laboratorio
-- Ejecutar con: Get-Content crear_datos_prueba.sql | docker exec -i salud_db psql -U admin_salud -d salud_laboral

-- 1. Crear usuario de prueba
INSERT INTO usuarios (id, dni, email, nombres, apellidos, telefono, rol, password_hash, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111'::uuid,
    '88888888',
    'webhook.test@lab.com',
    'Test',
    'Webhook',
    '999888777',
    'patient',
    '$2a$10$abcdefghijklmnopqrstuv',  -- Password hash simple
    NOW(),
    NOW()
)
ON CONFLICT (dni) DO UPDATE SET 
    email = EXCLUDED.email,
    id = '11111111-1111-1111-1111-111111111111'::uuid;

-- 2. Crear paciente
INSERT INTO pacientes (id, usuario_id, fecha_nacimiento, genero, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    '1990-01-01',
    'M',
    NOW(),
    NOW()
)
ON CONFLICT (usuario_id) DO UPDATE SET
    id = '22222222-2222-2222-2222-222222222222'::uuid;

-- 3. Crear muestra de laboratorio
INSERT INTO muestras_laboratorio (id, codigo_muestra, paciente_id, tipo_muestra, estado, created_at, updated_at)
VALUES (
    '33333333-3333-3333-3333-333333333333'::uuid,
    'M-TEST-001',
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Sangre',
    'procesando',
    NOW(),
    NOW()
)
ON CONFLICT (codigo_muestra) DO UPDATE SET
    id = '33333333-3333-3333-3333-333333333333'::uuid;

-- 4. Crear tipo de examen
INSERT INTO tipos_examen_laboratorio (id, codigo, nombre, categoria, activo, created_at, updated_at)
VALUES (
    '44444444-4444-4444-4444-444444444444'::uuid,
    'TEST-HEM',
    'Test Hemograma',
    'Hematología',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (codigo) DO UPDATE SET
    id = '44444444-4444-4444-4444-444444444444'::uuid;

-- 5. Crear solicitud de laboratorio
INSERT INTO solicitudes_laboratorio (id, muestra_id, tipo_examen_id, codigo_solicitud, estado, created_at, updated_at)
VALUES (
    '55555555-5555-5555-5555-555555555555'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    '44444444-4444-4444-4444-444444444444'::uuid,
    'SOL-TEST-001',
    'procesando',
    NOW(),
    NOW()
)
ON CONFLICT (codigo_solicitud) DO UPDATE SET
    id = '55555555-5555-5555-5555-555555555555'::uuid;

-- Mostrar el ID de la solicitud creada
SELECT '✅ Datos de prueba creados exitosamente!' as mensaje;
SELECT '📋 ID de solicitud para usar en la prueba:' as info;
SELECT id FROM solicitudes_laboratorio WHERE codigo_solicitud = 'SOL-TEST-001';

