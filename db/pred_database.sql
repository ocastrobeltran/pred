-- =============================================
-- FASE 1: CREAR TODAS LAS TABLAS SIN CLAVES FORÁNEAS
-- =============================================

-- Tabla de roles de usuario
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    created_at DATETIME,
    updated_at DATETIME
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    cedula VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    direccion TEXT,
    rol_id INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente',
    token_verificacion VARCHAR(100),
    token_expiracion DATETIME,
    ultimo_login DATETIME,
    created_at DATETIME,
    updated_at DATETIME
);

-- Tabla de localidades/ubicaciones
CREATE TABLE IF NOT EXISTS localidades (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at DATETIME,
    updated_at DATETIME
);

-- Tabla de deportes
CREATE TABLE IF NOT EXISTS deportes (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME
);

-- Tabla de amenidades/características
CREATE TABLE IF NOT EXISTS amenidades (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME
);

-- Tabla de escenarios deportivos
CREATE TABLE IF NOT EXISTS escenarios (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    capacidad INT,
    dimensiones VARCHAR(50),
    localidad_id INT NOT NULL,
    deporte_principal_id INT NOT NULL,
    direccion TEXT,
    estado VARCHAR(20) DEFAULT 'disponible',
    imagen_principal VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);

-- Tabla de relación entre escenarios y deportes
CREATE TABLE IF NOT EXISTS escenario_deportes (
    id INT PRIMARY KEY,
    escenario_id INT NOT NULL,
    deporte_id INT NOT NULL,
    created_at DATETIME
);

-- Tabla de relación entre escenarios y amenidades
CREATE TABLE IF NOT EXISTS escenario_amenidades (
    id INT PRIMARY KEY,
    escenario_id INT NOT NULL,
    amenidad_id INT NOT NULL,
    created_at DATETIME
);

-- Tabla de imágenes de escenarios (galería)
CREATE TABLE IF NOT EXISTS escenario_imagenes (
    id INT PRIMARY KEY,
    escenario_id INT NOT NULL,
    url_imagen VARCHAR(255) NOT NULL,
    es_principal BOOLEAN DEFAULT FALSE,
    orden INT DEFAULT 0,
    created_at DATETIME
);

-- Tabla de horarios disponibles por escenario
CREATE TABLE IF NOT EXISTS horarios_disponibles (
    id INT PRIMARY KEY,
    escenario_id INT NOT NULL,
    dia_semana VARCHAR(20) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    created_at DATETIME,
    updated_at DATETIME
);

-- Tabla de estados de solicitud
CREATE TABLE IF NOT EXISTS estados_solicitud (
    id INT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    color VARCHAR(20),
    created_at DATETIME,
    updated_at DATETIME
);

-- Tabla de propósitos de reserva
CREATE TABLE IF NOT EXISTS propositos_reserva (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at DATETIME,
    updated_at DATETIME
);

-- Tabla de solicitudes de reserva
CREATE TABLE IF NOT EXISTS solicitudes (
    id INT PRIMARY KEY,
    usuario_id INT NOT NULL,
    escenario_id INT NOT NULL,
    fecha_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    proposito_id INT NOT NULL,
    num_participantes INT NOT NULL,
    estado_id INT NOT NULL,
    notas TEXT,
    admin_id INT,
    admin_notas TEXT,
    fecha_respuesta DATETIME,
    codigo_reserva VARCHAR(20) UNIQUE,
    created_at DATETIME,
    updated_at DATETIME
);

-- Tabla de historial de cambios de estado de solicitudes
CREATE TABLE IF NOT EXISTS historial_estados_solicitud (
    id INT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    estado_anterior_id INT,
    estado_nuevo_id INT NOT NULL,
    usuario_id INT NOT NULL,
    notas TEXT,
    created_at DATETIME
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id INT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo VARCHAR(20) DEFAULT 'info',
    leida BOOLEAN DEFAULT FALSE,
    url VARCHAR(255),
    created_at DATETIME
);

-- Tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS configuracion (
    id INT PRIMARY KEY,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    descripcion TEXT,
    created_at DATETIME,
    updated_at DATETIME
);

-- =============================================
-- FASE 2: AGREGAR TODAS LAS CLAVES FORÁNEAS
-- =============================================

-- Agregar claves foráneas a la tabla usuarios
ALTER TABLE usuarios
ADD CONSTRAINT fk_usuarios_roles
FOREIGN KEY (rol_id) REFERENCES roles(id);

-- Agregar claves foráneas a la tabla escenarios
ALTER TABLE escenarios
ADD CONSTRAINT fk_escenarios_localidades
FOREIGN KEY (localidad_id) REFERENCES localidades(id),
ADD CONSTRAINT fk_escenarios_deportes
FOREIGN KEY (deporte_principal_id) REFERENCES deportes(id);

-- Agregar claves foráneas a la tabla escenario_deportes
ALTER TABLE escenario_deportes
ADD CONSTRAINT fk_escenario_deportes_escenarios
FOREIGN KEY (escenario_id) REFERENCES escenarios(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_escenario_deportes_deportes
FOREIGN KEY (deporte_id) REFERENCES deportes(id) ON DELETE CASCADE;

-- Agregar claves foráneas a la tabla escenario_amenidades
ALTER TABLE escenario_amenidades
ADD CONSTRAINT fk_escenario_amenidades_escenarios
FOREIGN KEY (escenario_id) REFERENCES escenarios(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_escenario_amenidades_amenidades
FOREIGN KEY (amenidad_id) REFERENCES amenidades(id) ON DELETE CASCADE;

-- Agregar claves foráneas a la tabla escenario_imagenes
ALTER TABLE escenario_imagenes
ADD CONSTRAINT fk_escenario_imagenes_escenarios
FOREIGN KEY (escenario_id) REFERENCES escenarios(id) ON DELETE CASCADE;

-- Agregar claves foráneas a la tabla horarios_disponibles
ALTER TABLE horarios_disponibles
ADD CONSTRAINT fk_horarios_disponibles_escenarios
FOREIGN KEY (escenario_id) REFERENCES escenarios(id) ON DELETE CASCADE;

-- Agregar claves foráneas a la tabla solicitudes
ALTER TABLE solicitudes
ADD CONSTRAINT fk_solicitudes_usuarios
FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
ADD CONSTRAINT fk_solicitudes_escenarios
FOREIGN KEY (escenario_id) REFERENCES escenarios(id),
ADD CONSTRAINT fk_solicitudes_propositos
FOREIGN KEY (proposito_id) REFERENCES propositos_reserva(id),
ADD CONSTRAINT fk_solicitudes_estados
FOREIGN KEY (estado_id) REFERENCES estados_solicitud(id),
ADD CONSTRAINT fk_solicitudes_admin
FOREIGN KEY (admin_id) REFERENCES usuarios(id);

-- Agregar claves foráneas a la tabla historial_estados_solicitud
ALTER TABLE historial_estados_solicitud
ADD CONSTRAINT fk_historial_solicitudes
FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
ADD CONSTRAINT fk_historial_estado_anterior
FOREIGN KEY (estado_anterior_id) REFERENCES estados_solicitud(id),
ADD CONSTRAINT fk_historial_estado_nuevo
FOREIGN KEY (estado_nuevo_id) REFERENCES estados_solicitud(id),
ADD CONSTRAINT fk_historial_usuarios
FOREIGN KEY (usuario_id) REFERENCES usuarios(id);

-- Agregar claves foráneas a la tabla notificaciones
ALTER TABLE notificaciones
ADD CONSTRAINT fk_notificaciones_usuarios
FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE;

-- Reactivar la verificación de claves foráneas
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- INSERTAR DATOS INICIALES
-- =============================================

-- Roles
INSERT INTO roles (id, nombre, descripcion, created_at, updated_at) VALUES 
(1, 'administrador', 'Administrador del sistema con acceso total', NOW(), NOW()),
(2, 'usuario', 'Usuario regular que puede realizar reservas', NOW(), NOW()),
(3, 'supervisor', 'Supervisor de escenarios deportivos', NOW(), NOW());

-- Estados de solicitud
INSERT INTO estados_solicitud (id, nombre, descripcion, color, created_at, updated_at) VALUES 
(1, 'creada', 'Solicitud recién creada, pendiente de revisión', '#FFC107', NOW(), NOW()),
(2, 'en_proceso', 'Solicitud en proceso de revisión por un administrador', '#3498DB', NOW(), NOW()),
(3, 'aprobada', 'Solicitud aprobada', '#28A745', NOW(), NOW()),
(4, 'rechazada', 'Solicitud rechazada', '#DC3545', NOW(), NOW());

-- Propósitos de reserva
INSERT INTO propositos_reserva (id, nombre, descripcion, created_at, updated_at) VALUES 
(1, 'Entrenamiento', 'Sesión de entrenamiento deportivo', NOW(), NOW()),
(2, 'Competencia', 'Evento competitivo oficial', NOW(), NOW()),
(3, 'Evento deportivo', 'Evento deportivo no competitivo', NOW(), NOW()),
(4, 'Recreación', 'Actividad recreativa', NOW(), NOW());

-- Localidades
INSERT INTO localidades (id, nombre, descripcion, created_at, updated_at) VALUES 
(1, 'Centro', 'Zona centro de Cartagena', NOW(), NOW()),
(2, 'Olaya Herrera', 'Barrio Olaya Herrera', NOW(), NOW()),
(3, 'Chiquinquirá', 'Barrio Chiquinquirá', NOW(), NOW()),
(4, 'El Campestre', 'Zona El Campestre', NOW(), NOW());

-- Deportes
INSERT INTO deportes (id, nombre, descripcion, icono, created_at, updated_at) VALUES 
(1, 'Fútbol', 'Fútbol en todas sus modalidades', 'fa-futbol', NOW(), NOW()),
(2, 'Béisbol', 'Béisbol y sus variantes', 'fa-baseball-ball', NOW(), NOW()),
(3, 'Baloncesto', 'Baloncesto y sus variantes', 'fa-basketball-ball', NOW(), NOW()),
(4, 'Natación', 'Natación y deportes acuáticos', 'fa-swimming-pool', NOW(), NOW()),
(5, 'Atletismo', 'Atletismo y sus disciplinas', 'fa-running', NOW(), NOW()),
(6, 'Voleibol', 'Voleibol y sus variantes', 'fa-volleyball-ball', NOW(), NOW()),
(7, 'Patinaje', 'Patinaje de velocidad y artístico', 'fa-skating', NOW(), NOW()),
(8, 'Softbol', 'Softbol y sus variantes', 'fa-baseball-ball', NOW(), NOW()),
(9, 'Levantamiento de pesas', 'Levantamiento de pesas y halterofilia', 'fa-dumbbell', NOW(), NOW());

-- Amenidades
INSERT INTO amenidades (id, nombre, descripcion, icono, created_at, updated_at) VALUES 
(1, 'Parqueadero', 'Área de estacionamiento para vehículos', 'fa-parking', NOW(), NOW()),
(2, 'Baños', 'Servicios sanitarios', 'fa-toilet', NOW(), NOW()),
(3, 'Iluminación', 'Sistema de iluminación para uso nocturno', 'fa-lightbulb', NOW(), NOW()),
(4, 'Cafetería', 'Servicio de cafetería y alimentos', 'fa-utensils', NOW(), NOW()),
(5, 'Primeros auxilios', 'Servicio de primeros auxilios', 'fa-first-aid', NOW(), NOW()),
(6, 'Accesibilidad', 'Instalaciones accesibles para personas con movilidad reducida', 'fa-wheelchair', NOW(), NOW()),
(7, 'Vestidores', 'Área de vestidores y duchas', 'fa-tshirt', NOW(), NOW()),
(8, 'Gradas', 'Gradas para espectadores', 'fa-users', NOW(), NOW());

-- Usuario administrador por defecto
INSERT INTO usuarios (id, nombre, apellido, email, password, cedula, telefono, rol_id, estado, created_at, updated_at) VALUES 
(1, 'Admin', 'IDER', 'admin@ider.gov.co', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '1234567890', '3001234567', 1, 'activo', NOW(), NOW());

-- Escenarios deportivos
INSERT INTO escenarios (id, nombre, descripcion, capacidad, dimensiones, localidad_id, deporte_principal_id, direccion, estado, imagen_principal, created_at, updated_at) VALUES 
(1, 'Estadio Jaime Morón', 'El Estadio Jaime Morón León es el principal escenario deportivo para la práctica del fútbol en la ciudad de Cartagena. Cuenta con una capacidad para 16.000 espectadores, césped natural y graderías techadas.', 16000, '105m x 68m', 2, 1, 'Barrio Olaya Herrera, Cartagena', 'disponible', 'estadio_jaime_moron.jpg', NOW(), NOW()),
(2, 'Estadio de Béisbol Once de Noviembre', 'Estadio de béisbol con capacidad para 12.000 espectadores, iluminación nocturna y palcos VIP.', 12000, '120m x 120m', 1, 2, 'Centro, Cartagena', 'disponible', 'estadio_beisbol.jpg', NOW(), NOW()),
(3, 'Complejo Acuático Jaime González Johnson', 'Complejo con piscina olímpica de 50 metros, piscina de clavados y áreas de entrenamiento.', 1000, '50m x 25m', 1, 4, 'Centro, Cartagena', 'disponible', 'complejo_acuatico.jpg', NOW(), NOW()),
(4, 'Pista de Atletismo Campo Elías Gutiérrez', 'Pista de atletismo con superficie sintética, 8 carriles y áreas para saltos y lanzamientos.', 3000, '400m', 1, 5, 'Centro, Cartagena', 'disponible', 'pista_atletismo.jpg', NOW(), NOW()),
(5, 'Coliseo de Combate y Gimnasia', 'Coliseo especializado para deportes de combate y gimnasia con áreas de entrenamiento.', 2000, '40m x 30m', 1, 9, 'Centro, Cartagena', 'disponible', 'coliseo_combate.jpg', NOW(), NOW()),
(6, 'Estadio de Softbol de Chiquinquirá', 'Campo de softbol con gradas, iluminación y servicios complementarios para eventos deportivos.', 3000, '80m x 80m', 3, 8, 'Chiquinquirá, Cartagena', 'disponible', 'estadio_softbol.jpg', NOW(), NOW()),
(7, 'Patinódromo de El Campestre', 'Pista de patinaje de velocidad con superficie especializada y graderías para espectadores.', 1500, '200m', 4, 7, 'El Campestre, Cartagena', 'disponible', 'patinodromo.jpg', NOW(), NOW()),
(8, 'Coliseo Norton Madrid', 'Coliseo multiusos con cancha de baloncesto, voleibol y eventos culturales.', 4000, '40m x 30m', 1, 3, 'Centro, Cartagena', 'disponible', 'coliseo_norton.jpg', NOW(), NOW());

-- Relaciones entre escenarios y deportes
INSERT INTO escenario_deportes (id, escenario_id, deporte_id, created_at) VALUES 
(1, 1, 1, NOW()), -- Estadio Jaime Morón - Fútbol
(2, 2, 2, NOW()), -- Estadio de Béisbol - Béisbol
(3, 3, 4, NOW()), -- Complejo Acuático - Natación
(4, 4, 5, NOW()), -- Pista de Atletismo - Atletismo
(5, 5, 9, NOW()), -- Coliseo de Combate - Levantamiento de pesas
(6, 6, 8, NOW()), -- Estadio de Softbol - Softbol
(7, 7, 7, NOW()), -- Patinódromo - Patinaje
(8, 8, 3, NOW()), -- Coliseo Norton Madrid - Baloncesto
(9, 8, 6, NOW()); -- Coliseo Norton Madrid - Voleibol

-- Relaciones entre escenarios y amenidades
INSERT INTO escenario_amenidades (id, escenario_id, amenidad_id, created_at) VALUES 
(1, 1, 1, NOW()), (2, 1, 2, NOW()), (3, 1, 3, NOW()), (4, 1, 4, NOW()), 
(5, 1, 5, NOW()), (6, 1, 6, NOW()), (7, 1, 7, NOW()), (8, 1, 8, NOW()), -- Estadio Jaime Morón
(9, 2, 1, NOW()), (10, 2, 2, NOW()), (11, 2, 3, NOW()), (12, 2, 4, NOW()), 
(13, 2, 5, NOW()), (14, 2, 8, NOW()), -- Estadio de Béisbol
(15, 3, 1, NOW()), (16, 3, 2, NOW()), (17, 3, 5, NOW()), (18, 3, 6, NOW()), 
(19, 3, 7, NOW()), -- Complejo Acuático
(20, 4, 1, NOW()), (21, 4, 2, NOW()), (22, 4, 3, NOW()), (23, 4, 5, NOW()), 
(24, 4, 8, NOW()), -- Pista de Atletismo
(25, 5, 1, NOW()), (26, 5, 2, NOW()), (27, 5, 5, NOW()), (28, 5, 6, NOW()), 
(29, 5, 7, NOW()), -- Coliseo de Combate
(30, 6, 1, NOW()), (31, 6, 2, NOW()), (32, 6, 3, NOW()), (33, 6, 8, NOW()), -- Estadio de Softbol
(34, 7, 1, NOW()), (35, 7, 2, NOW()), (36, 7, 5, NOW()), (37, 7, 8, NOW()), -- Patinódromo
(38, 8, 1, NOW()), (39, 8, 2, NOW()), (40, 8, 3, NOW()), (41, 8, 4, NOW()), 
(42, 8, 5, NOW()), (43, 8, 6, NOW()), (44, 8, 7, NOW()), (45, 8, 8, NOW()); -- Coliseo Norton Madrid

-- Imágenes de escenarios
INSERT INTO escenario_imagenes (id, escenario_id, url_imagen, es_principal, orden, created_at) VALUES 
(1, 1, 'estadio_jaime_moron.jpg', TRUE, 1, NOW()),
(2, 1, 'estadio_jaime_moron_2.jpg', FALSE, 2, NOW()),
(3, 1, 'estadio_jaime_moron_3.jpg', FALSE, 3, NOW()),
(4, 1, 'estadio_jaime_moron_4.jpg', FALSE, 4, NOW()),
(5, 2, 'estadio_beisbol.jpg', TRUE, 1, NOW()),
(6, 2, 'estadio_beisbol_2.jpg', FALSE, 2, NOW()),
(7, 2, 'estadio_beisbol_3.jpg', FALSE, 3, NOW()),
(8, 3, 'complejo_acuatico.jpg', TRUE, 1, NOW()),
(9, 3, 'complejo_acuatico_2.jpg', FALSE, 2, NOW()),
(10, 3, 'complejo_acuatico_3.jpg', FALSE, 3, NOW()),
(11, 4, 'pista_atletismo.jpg', TRUE, 1, NOW()),
(12, 4, 'pista_atletismo_2.jpg', FALSE, 2, NOW()),
(13, 5, 'coliseo_combate.jpg', TRUE, 1, NOW()),
(14, 5, 'coliseo_combate_2.jpg', FALSE, 2, NOW()),
(15, 6, 'estadio_softbol.jpg', TRUE, 1, NOW()),
(16, 6, 'estadio_softbol_2.jpg', FALSE, 2, NOW()),
(17, 7, 'patinodromo.jpg', TRUE, 1, NOW()),
(18, 7, 'patinodromo_2.jpg', FALSE, 2, NOW()),
(19, 8, 'coliseo_norton.jpg', TRUE, 1, NOW()),
(20, 8, 'coliseo_norton_2.jpg', FALSE, 2, NOW()),
(21, 8, 'coliseo_norton_3.jpg', FALSE, 3, NOW());

-- Horarios disponibles para cada escenario (ejemplo para el Estadio Jaime Morón)
INSERT INTO horarios_disponibles (id, escenario_id, dia_semana, hora_inicio, hora_fin, disponible, created_at, updated_at) VALUES 
(1, 1, 'lunes', '08:00:00', '10:00:00', TRUE, NOW(), NOW()),
(2, 1, 'lunes', '10:00:00', '12:00:00', TRUE, NOW(), NOW()),
(3, 1, 'lunes', '14:00:00', '16:00:00', TRUE, NOW(), NOW()),
(4, 1, 'lunes', '16:00:00', '18:00:00', TRUE, NOW(), NOW()),
(5, 1, 'martes', '08:00:00', '10:00:00', TRUE, NOW(), NOW()),
(6, 1, 'martes', '10:00:00', '12:00:00', TRUE, NOW(), NOW()),
(7, 1, 'martes', '14:00:00', '16:00:00', TRUE, NOW(), NOW()),
(8, 1, 'martes', '16:00:00', '18:00:00', TRUE, NOW(), NOW()),
(9, 1, 'miercoles', '08:00:00', '10:00:00', TRUE, NOW(), NOW()),
(10, 1, 'miercoles', '10:00:00', '12:00:00', TRUE, NOW(), NOW()),
(11, 1, 'miercoles', '14:00:00', '16:00:00', TRUE, NOW(), NOW()),
(12, 1, 'miercoles', '16:00:00', '18:00:00', TRUE, NOW(), NOW()),
(13, 1, 'jueves', '08:00:00', '10:00:00', TRUE, NOW(), NOW()),
(14, 1, 'jueves', '10:00:00', '12:00:00', TRUE, NOW(), NOW()),
(15, 1, 'jueves', '14:00:00', '16:00:00', TRUE, NOW(), NOW()),
(16, 1, 'jueves', '16:00:00', '18:00:00', TRUE, NOW(), NOW()),
(17, 1, 'viernes', '08:00:00', '10:00:00', TRUE, NOW(), NOW()),
(18, 1, 'viernes', '10:00:00', '12:00:00', TRUE, NOW(), NOW()),
(19, 1, 'viernes', '14:00:00', '16:00:00', TRUE, NOW(), NOW()),
(20, 1, 'viernes', '16:00:00', '18:00:00', TRUE, NOW(), NOW()),
(21, 1, 'sabado', '09:00:00', '11:00:00', TRUE, NOW(), NOW()),
(22, 1, 'sabado', '11:00:00', '13:00:00', TRUE, NOW(), NOW()),
(23, 1, 'sabado', '14:00:00', '16:00:00', TRUE, NOW(), NOW()),
(24, 1, 'domingo', '09:00:00', '11:00:00', TRUE, NOW(), NOW()),
(25, 1, 'domingo', '11:00:00', '13:00:00', TRUE, NOW(), NOW());

-- Configuración del sistema
INSERT INTO configuracion (id, clave, valor, descripcion, created_at, updated_at) VALUES 
(1, 'dias_anticipacion_reserva', '30', 'Número máximo de días de anticipación para realizar una reserva', NOW(), NOW()),
(2, 'horas_cancelacion', '24', 'Número de horas antes del evento para permitir cancelaciones', NOW(), NOW()),
(3, 'email_notificaciones', 'notificaciones@ider.gov.co', 'Email desde el cual se envían las notificaciones', NOW(), NOW()),
(4, 'nombre_sistema', 'PRED - Plataforma de Prestación de Escenarios Deportivos', 'Nombre completo del sistema', NOW(), NOW()),
(5, 'version', '1.0.0', 'Versión actual del sistema', NOW(), NOW());

-- =============================================
-- CREAR VISTAS E ÍNDICES
-- =============================================

-- Vista de escenarios con su información completa
CREATE OR REPLACE VIEW vista_escenarios AS
SELECT 
    e.id, 
    e.nombre, 
    e.descripcion, 
    e.capacidad, 
    e.dimensiones, 
    l.nombre AS localidad, 
    d.nombre AS deporte_principal,
    d.icono AS icono_deporte,
    e.direccion, 
    e.estado,
    e.imagen_principal,
    e.created_at,
    e.updated_at
FROM 
    escenarios e
JOIN 
    localidades l ON e.localidad_id = l.id
JOIN 
    deportes d ON e.deporte_principal_id = d.id;

-- Vista de solicitudes con información completa
CREATE OR REPLACE VIEW vista_solicitudes AS
SELECT 
    s.id,
    s.fecha_reserva,
    s.hora_inicio,
    s.hora_fin,
    s.num_participantes,
    s.notas,
    s.codigo_reserva,
    s.created_at,
    u.nombre AS usuario_nombre,
    u.apellido AS usuario_apellido,
    u.email AS usuario_email,
    e.nombre AS escenario_nombre,
    l.nombre AS escenario_localidad,
    p.nombre AS proposito,
    es.nombre AS estado,
    es.color AS estado_color,
    a.nombre AS admin_nombre,
    a.apellido AS admin_apellido,
    s.admin_notas,
    s.fecha_respuesta
FROM 
    solicitudes s
JOIN 
    usuarios u ON s.usuario_id = u.id
JOIN 
    escenarios e ON s.escenario_id = e.id
JOIN 
    localidades l ON e.localidad_id = l.id
JOIN 
    propositos_reserva p ON s.proposito_id = p.id
JOIN 
    estados_solicitud es ON s.estado_id = es.id
LEFT JOIN 
    usuarios a ON s.admin_id = a.id;

-- Índices adicionales para mejorar el rendimiento
CREATE INDEX idx_escenarios_deporte ON escenarios(deporte_principal_id);

-- Índice para búsquedas de escenarios por localidad
CREATE INDEX idx_escenarios_localidad ON escenarios(localidad_id);

-- Índice para búsquedas de solicitudes por fecha
CREATE INDEX idx_solicitudes_fecha ON solicitudes(fecha_reserva);

-- Índice para búsquedas de solicitudes por estado
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado_id);

-- Índice para búsquedas de solicitudes por usuario
CREATE INDEX idx_solicitudes_usuario ON solicitudes(usuario_id);

-- Índice para búsquedas de notificaciones no leídas
CREATE INDEX idx_notificaciones_no_leidas ON notificaciones(usuario_id, leida);