DROP DATABASE IF EXISTS pacific_reef_reservas;
CREATE DATABASE pacific_reef_reservas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pacific_reef_reservas;

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT uq_roles_nombre UNIQUE (nombre)
);

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    id_rol INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    clave_hash VARCHAR(255) NOT NULL,
    idioma ENUM('es', 'en') NOT NULL DEFAULT 'es',
    estado ENUM('activo', 'inactivo', 'bloqueado') NOT NULL DEFAULT 'activo',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_usuarios_correo UNIQUE (correo),
    CONSTRAINT fk_usuarios_roles FOREIGN KEY (id_rol) REFERENCES roles (id_rol)
);

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    telefono VARCHAR(30) NULL,
    documento VARCHAR(30) NULL,
    CONSTRAINT uq_clientes_usuario UNIQUE (id_usuario),
    CONSTRAINT uq_clientes_documento UNIQUE (documento),
    CONSTRAINT fk_clientes_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

CREATE TABLE trabajadores (
    id_trabajador INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    estado_laboral ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    CONSTRAINT uq_trabajadores_usuario UNIQUE (id_usuario),
    CONSTRAINT fk_trabajadores_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

CREATE TABLE categorias_habitacion (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT uq_categorias_nombre UNIQUE (nombre)
);

CREATE TABLE habitaciones (
    id_habitacion INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    numero VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    capacidad INT NOT NULL,
    descripcion VARCHAR(255) NULL,
    estado ENUM('disponible', 'ocupada', 'mantenimiento', 'inactiva') NOT NULL DEFAULT 'disponible',
    CONSTRAINT uq_habitaciones_numero UNIQUE (numero),
    CONSTRAINT chk_habitaciones_capacidad CHECK (capacidad > 0),
    CONSTRAINT fk_habitaciones_categoria FOREIGN KEY (id_categoria) REFERENCES categorias_habitacion (id_categoria)
);

CREATE TABLE imagenes_habitacion (
    id_imagen INT AUTO_INCREMENT PRIMARY KEY,
    id_habitacion INT NOT NULL,
    url_imagen VARCHAR(255) NOT NULL,
    texto_alternativo VARCHAR(255) NULL,
    es_principal BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_imagenes_habitacion FOREIGN KEY (id_habitacion) REFERENCES habitaciones (id_habitacion)
);

CREATE TABLE equipamientos (
    id_equipamiento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255) NULL,
    CONSTRAINT uq_equipamientos_nombre UNIQUE (nombre)
);

CREATE TABLE habitacion_equipamiento (
    id_habitacion INT NOT NULL,
    id_equipamiento INT NOT NULL,
    PRIMARY KEY (id_habitacion, id_equipamiento),
    CONSTRAINT fk_habitacion_equipamiento_habitacion FOREIGN KEY (id_habitacion) REFERENCES habitaciones (id_habitacion),
    CONSTRAINT fk_habitacion_equipamiento_equipamiento FOREIGN KEY (id_equipamiento) REFERENCES equipamientos (id_equipamiento)
);

CREATE TABLE precios_habitacion (
    id_precio INT AUTO_INCREMENT PRIMARY KEY,
    id_habitacion INT NOT NULL,
    valor_diario DECIMAL(10, 2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
    estado ENUM('vigente', 'inactivo') NOT NULL DEFAULT 'vigente',
    CONSTRAINT chk_precios_valor_diario CHECK (valor_diario > 0),
    CONSTRAINT chk_precios_rango CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio),
    CONSTRAINT fk_precios_habitacion FOREIGN KEY (id_habitacion) REFERENCES habitaciones (id_habitacion)
);

CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_habitacion INT NOT NULL,
    fecha_entrada DATE NOT NULL,
    fecha_salida DATE NOT NULL,
    cantidad_dias INT NOT NULL,
    monto_total DECIMAL(10, 2) NOT NULL,
    monto_reserva DECIMAL(10, 2) NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada', 'finalizada') NOT NULL DEFAULT 'pendiente',
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_reservas_fechas CHECK (fecha_salida > fecha_entrada),
    CONSTRAINT chk_reservas_cantidad_dias CHECK (cantidad_dias > 0),
    CONSTRAINT chk_reservas_montos CHECK (monto_total >= monto_reserva AND monto_reserva >= 0),
    CONSTRAINT fk_reservas_cliente FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente),
    CONSTRAINT fk_reservas_habitacion FOREIGN KEY (id_habitacion) REFERENCES habitaciones (id_habitacion)
);

CREATE TABLE pagos_reserva (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    medio_pago ENUM('tarjeta', 'transferencia', 'efectivo', 'webpay') NOT NULL,
    estado ENUM('pendiente', 'pagado', 'rechazado') NOT NULL DEFAULT 'pagado',
    fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_pagos_monto CHECK (monto > 0),
    CONSTRAINT fk_pagos_reserva FOREIGN KEY (id_reserva) REFERENCES reservas (id_reserva)
);

CREATE TABLE tickets_reserva (
    id_ticket INT AUTO_INCREMENT PRIMARY KEY,
    id_reserva INT NOT NULL,
    codigo_ticket VARCHAR(50) NOT NULL,
    codigo_qr VARCHAR(255) NOT NULL,
    fecha_emision DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tickets_reserva UNIQUE (id_reserva),
    CONSTRAINT uq_tickets_codigo UNIQUE (codigo_ticket),
    CONSTRAINT fk_tickets_reserva FOREIGN KEY (id_reserva) REFERENCES reservas (id_reserva)
);

CREATE INDEX idx_usuarios_id_rol ON usuarios (id_rol);
CREATE INDEX idx_habitaciones_id_categoria ON habitaciones (id_categoria);
CREATE INDEX idx_imagenes_id_habitacion ON imagenes_habitacion (id_habitacion);
CREATE INDEX idx_precios_id_habitacion ON precios_habitacion (id_habitacion);
CREATE INDEX idx_reservas_cliente ON reservas (id_cliente);
CREATE INDEX idx_reservas_habitacion ON reservas (id_habitacion);
CREATE INDEX idx_reservas_fechas ON reservas (fecha_entrada, fecha_salida);
CREATE INDEX idx_pagos_id_reserva ON pagos_reserva (id_reserva);

INSERT INTO roles (nombre, descripcion)
VALUES
    ('cliente', 'Usuario final que consulta disponibilidad y realiza reservas.'),
    ('administrador', 'Usuario con permisos de gestion sobre reservas, clientes, trabajadores y catalogo.'),
    ('trabajador', 'Usuario interno que consulta reservas, calendario y servicio contratado.');

INSERT INTO categorias_habitacion (nombre, descripcion)
VALUES
    ('turista', 'Habitacion orientada a estadias estandar.'),
    ('premium', 'Habitacion con equipamiento y servicio superior.');

INSERT INTO equipamientos (nombre, descripcion)
VALUES
    ('wifi', 'Conexion inalambrica a internet.'),
    ('aire acondicionado', 'Sistema de climatizacion individual.'),
    ('television', 'Televisor con servicio de canales.'),
    ('minibar', 'Frigobar con productos de consumo.');