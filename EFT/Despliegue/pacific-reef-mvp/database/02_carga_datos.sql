USE pacific_reef_reservas;

INSERT INTO roles (nombre, descripcion)
VALUES
    ('cliente', 'Usuario final que consulta disponibilidad y realiza reservas.'),
    ('administrador', 'Usuario con permisos de gestion sobre reservas, clientes, trabajadores y catalogo.'),
    ('trabajador', 'Usuario interno que consulta reservas y servicios para la operacion.');

INSERT INTO usuarios (id_rol, nombre, apellido, correo, clave_hash, idioma, estado)
VALUES
    -- Administrador: Admin123*
    (2, 'Carolina', 'Rojas', 'admin@pacificreef.cl', '$2a$10$0eLws5jMYX06/n/hHU1nmuxjoXwdVZ9KP37IPfP9W0rXMoeXjuU6O', 'es', 'activo'),
    -- Trabajador: Trabajador123*
    (3, 'Miguel', 'Soto', 'trabajador@pacificreef.cl', '$2a$10$.09Rd.wTlU7aIehaeq147uUgnzZA/YnHhIrk26mtbkVunUL6Ja0UO', 'es', 'activo'),
    -- Clientes: todos usan Cliente123*
    (1, 'Ana', 'Paredes', 'ana.paredes@email.com', '$2a$10$w1Q0AleSXejWgFre6yFaEexevL7l1mHbZnNN3Y95oPl0aGH7dF5aW', 'es', 'activo'),
    (1, 'Thomas', 'Green', 'thomas.green@email.com', '$2a$10$w1Q0AleSXejWgFre6yFaEexevL7l1mHbZnNN3Y95oPl0aGH7dF5aW', 'en', 'activo'),
    (1, 'Valentina', 'Muñoz', 'valentina.munoz@email.com', '$2a$10$w1Q0AleSXejWgFre6yFaEexevL7l1mHbZnNN3Y95oPl0aGH7dF5aW', 'es', 'activo'),
    (1, 'Diego', 'Fuentes', 'diego.fuentes@email.com', '$2a$10$w1Q0AleSXejWgFre6yFaEexevL7l1mHbZnNN3Y95oPl0aGH7dF5aW', 'es', 'activo'),
    (1, 'Camila', 'Reyes', 'camila.reyes@email.com', '$2a$10$w1Q0AleSXejWgFre6yFaEexevL7l1mHbZnNN3Y95oPl0aGH7dF5aW', 'es', 'activo');

INSERT INTO clientes (id_usuario, telefono, documento)
VALUES
    (3, '+56911111111', '12345678-9'),
    (4, '+447700900123', 'P1234567'),
    (5, '+56922223333', '18765432-1'),
    (6, '+56933334444', '20111222-3'),
    (7, '+56944445555', '19876543-2');

INSERT INTO trabajadores (id_usuario, cargo, estado_laboral)
VALUES
    (2, 'Administrador general', 'activo');

INSERT INTO categorias_habitacion (nombre, descripcion)
VALUES
    ('turista', 'Habitacion comoda para estadias estandar y viajes cortos.'),
    ('premium', 'Habitacion con mayor amplitud y servicios superiores.'),
    ('familiar', 'Habitacion preparada para grupos o familias pequenas.');

INSERT INTO habitaciones (id_categoria, numero, nombre, capacidad, descripcion, estado)
VALUES
    (1, '101', 'Pacific Turista 101', 2, 'Habitacion estandar con vista parcial al jardin.', 'disponible'),
    (1, '102', 'Pacific Turista 102', 2, 'Habitacion estandar cercana al area comun.', 'disponible'),
    (1, '103', 'Pacific Turista 103', 2, 'Habitacion estandar con iluminacion natural y escritorio.', 'disponible'),
    (2, '201', 'Pacific Premium 201', 3, 'Habitacion premium con vista al mar.', 'disponible'),
    (2, '202', 'Pacific Premium 202', 3, 'Habitacion premium con balcon privado.', 'mantenimiento'),
    (2, '203', 'Pacific Premium 203', 3, 'Habitacion premium renovada con area de descanso.', 'disponible'),
    (3, '301', 'Pacific Familiar 301', 4, 'Habitacion familiar con dos ambientes.', 'disponible'),
    (3, '302', 'Pacific Familiar 302', 4, 'Habitacion familiar amplia con vista a la piscina.', 'disponible');

INSERT INTO imagenes_habitacion (id_habitacion, url_imagen, texto_alternativo, es_principal)
VALUES
    (1, 'https://images.example.com/habitaciones/101-principal.jpg', 'Vista principal habitacion Pacific Turista 101', TRUE),
    (2, 'https://images.example.com/habitaciones/102-principal.jpg', 'Vista principal habitacion Pacific Turista 102', TRUE),
    (3, 'https://images.example.com/habitaciones/103-principal.jpg', 'Vista principal habitacion Pacific Turista 103', TRUE),
    (4, 'https://images.example.com/habitaciones/201-principal.jpg', 'Vista principal habitacion Pacific Premium 201', TRUE),
    (5, 'https://images.example.com/habitaciones/202-principal.jpg', 'Vista principal habitacion Pacific Premium 202', TRUE),
    (6, 'https://images.example.com/habitaciones/203-principal.jpg', 'Vista principal habitacion Pacific Premium 203', TRUE),
    (7, 'https://images.example.com/habitaciones/301-principal.jpg', 'Vista principal habitacion Pacific Familiar 301', TRUE),
    (8, 'https://images.example.com/habitaciones/302-principal.jpg', 'Vista principal habitacion Pacific Familiar 302', TRUE);

INSERT INTO equipamientos (nombre, descripcion)
VALUES
    ('wifi', 'Conexion inalambrica de alta velocidad.'),
    ('aire acondicionado', 'Climatizacion independiente.'),
    ('television', 'Televisor con canales nacionales e internacionales.'),
    ('minibar', 'Frigobar con productos de consumo.'),
    ('caja fuerte', 'Caja de seguridad para efectos personales.');

INSERT INTO habitacion_equipamiento (id_habitacion, id_equipamiento)
VALUES
    (1, 1), (1, 3),
    (2, 1), (2, 2), (2, 3),
    (3, 1), (3, 3), (3, 5),
    (4, 1), (4, 2), (4, 3), (4, 4), (4, 5),
    (5, 1), (5, 2), (5, 3), (5, 4),
    (6, 1), (6, 2), (6, 3), (6, 5),
    (7, 1), (7, 2), (7, 3), (7, 4), (7, 5),
    (8, 1), (8, 2), (8, 3), (8, 5);

INSERT INTO precios_habitacion (id_habitacion, valor_diario, fecha_inicio, fecha_fin, estado)
VALUES
    (1, 65000.00, '2026-01-01', NULL, 'vigente'),
    (2, 68000.00, '2026-01-01', NULL, 'vigente'),
    (3, 72000.00, '2026-01-01', NULL, 'vigente'),
    (4, 98000.00, '2026-01-01', NULL, 'vigente'),
    (5, 105000.00, '2026-01-01', NULL, 'vigente'),
    (6, 112000.00, '2026-01-01', NULL, 'vigente'),
    (7, 125000.00, '2026-01-01', NULL, 'vigente'),
    (8, 132000.00, '2026-01-01', NULL, 'vigente');

INSERT INTO reservas (
    codigo_reserva,
    id_cliente,
    id_habitacion,
    fecha_entrada,
    fecha_salida,
    cantidad_dias,
    cantidad_huespedes,
    monto_total,
    monto_reserva,
    estado,
    observaciones
)
VALUES
    -- Reserva activa HOY (4 may 2026): sirve para probar panel trabajador
    ('RES-2026-0001', 1, 1, '2026-05-02', '2026-05-06', 4, 2, 260000.00, 78000.00, 'confirmada', 'Huesped nacional activo, check-in realizado.'),
    -- Reserva con check-in HOY: aparece en panel trabajador como llegada del dia
    ('RES-2026-0002', 2, 4, '2026-05-04', '2026-05-08', 4, 2, 392000.00, 117600.00, 'confirmada', 'Cliente solicita early check-in si es posible.'),
    -- Reserva futura proxima semana
    ('RES-2026-0003', 3, 7, '2026-05-10', '2026-05-13', 3, 4, 375000.00, 112500.00, 'pendiente', 'Reserva familiar para semana siguiente.'),
    -- Reserva futura lejana: disponible para probar busqueda de disponibilidad
    ('RES-2026-0004', 4, 6, '2026-06-01', '2026-06-05', 4, 2, 448000.00, 134400.00, 'confirmada', 'Viaje de negocios, requiere factura.'),
    -- Reserva finalizada (historico): para probar metricas del panel admin
    ('RES-2026-0005', 5, 3, '2026-04-10', '2026-04-14', 4, 2, 288000.00, 86400.00, 'finalizada', 'Reserva de prueba historica, mes anterior.');

INSERT INTO pagos_reserva (id_reserva, monto, medio_pago, estado, referencia_pago)
VALUES
    (1, 78000.00, 'webpay', 'pagado', 'WBP-RES-2026-0001'),
    (2, 117600.00, 'tarjeta', 'pagado', 'TRJ-RES-2026-0002'),
    (3, 112500.00, 'transferencia', 'pendiente', 'TRF-RES-2026-0003'),
    (4, 134400.00, 'webpay', 'pagado', 'WBP-RES-2026-0004'),
    (5, 86400.00, 'transferencia', 'pagado', 'TRF-RES-2026-0005');

INSERT INTO tickets_reserva (id_reserva, codigo_ticket, codigo_qr)
VALUES
    (1, 'TCK-2026-0001', 'QR-RES-2026-0001'),
    (2, 'TCK-2026-0002', 'QR-RES-2026-0002'),
    (3, 'TCK-2026-0003', 'QR-RES-2026-0003'),
    (4, 'TCK-2026-0004', 'QR-RES-2026-0004'),
    (5, 'TCK-2026-0005', 'QR-RES-2026-0005');