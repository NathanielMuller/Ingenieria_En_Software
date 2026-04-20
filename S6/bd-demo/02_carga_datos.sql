USE pacific_reef_reservas;

INSERT INTO roles (nombre, descripcion)
VALUES
    ('cliente', 'Usuario final que consulta disponibilidad y realiza reservas.'),
    ('administrador', 'Usuario con permisos de gestion sobre reservas, clientes, trabajadores y catalogo.'),
    ('trabajador', 'Usuario interno que consulta reservas y servicios para la operacion.');

INSERT INTO usuarios (id_rol, nombre, apellido, correo, clave_hash, idioma, estado)
VALUES
    (2, 'Carolina', 'Rojas', 'admin@pacificreef.cl', 'hash_admin_demo', 'es', 'activo'),
    (3, 'Miguel', 'Soto', 'trabajador@pacificreef.cl', 'hash_trab_demo', 'es', 'activo'),
    (1, 'Ana', 'Paredes', 'ana.paredes@email.com', 'hash_cliente_01', 'es', 'activo'),
    (1, 'Thomas', 'Green', 'thomas.green@email.com', 'hash_cliente_02', 'en', 'activo'),
    (1, 'Valentina', 'Muñoz', 'valentina.munoz@email.com', 'hash_cliente_03', 'es', 'activo');

INSERT INTO clientes (id_usuario, telefono, documento)
VALUES
    (3, '+56911111111', '12345678-9'),
    (4, '+447700900123', 'P1234567'),
    (5, '+56922223333', '18765432-1');

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
    (2, '201', 'Pacific Premium 201', 3, 'Habitacion premium con vista al mar.', 'disponible'),
    (2, '202', 'Pacific Premium 202', 3, 'Habitacion premium con balcon privado.', 'mantenimiento'),
    (3, '301', 'Pacific Familiar 301', 4, 'Habitacion familiar con dos ambientes.', 'disponible');

INSERT INTO imagenes_habitacion (id_habitacion, url_imagen, texto_alternativo, es_principal)
VALUES
    (1, 'https://images.example.com/habitaciones/101-principal.jpg', 'Vista principal habitacion Pacific Turista 101', TRUE),
    (2, 'https://images.example.com/habitaciones/102-principal.jpg', 'Vista principal habitacion Pacific Turista 102', TRUE),
    (3, 'https://images.example.com/habitaciones/201-principal.jpg', 'Vista principal habitacion Pacific Premium 201', TRUE),
    (4, 'https://images.example.com/habitaciones/202-principal.jpg', 'Vista principal habitacion Pacific Premium 202', TRUE),
    (5, 'https://images.example.com/habitaciones/301-principal.jpg', 'Vista principal habitacion Pacific Familiar 301', TRUE);

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
    (3, 1), (3, 2), (3, 3), (3, 4), (3, 5),
    (4, 1), (4, 2), (4, 3), (4, 4),
    (5, 1), (5, 2), (5, 3), (5, 5);

INSERT INTO precios_habitacion (id_habitacion, valor_diario, fecha_inicio, fecha_fin, estado)
VALUES
    (1, 65000.00, '2026-01-01', NULL, 'vigente'),
    (2, 68000.00, '2026-01-01', NULL, 'vigente'),
    (3, 98000.00, '2026-01-01', NULL, 'vigente'),
    (4, 105000.00, '2026-01-01', NULL, 'vigente'),
    (5, 125000.00, '2026-01-01', NULL, 'vigente');

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
    ('RES-2026-0001', 1, 1, '2026-05-10', '2026-05-13', 3, 2, 195000.00, 58500.00, 'confirmada', 'Reserva de prueba para cliente nacional.'),
    ('RES-2026-0002', 2, 3, '2026-06-01', '2026-06-05', 4, 2, 392000.00, 117600.00, 'pendiente', 'Cliente solicita early check-in si es posible.'),
    ('RES-2026-0003', 3, 5, '2026-07-15', '2026-07-18', 3, 4, 375000.00, 112500.00, 'finalizada', 'Reserva utilizada como historico de ejemplo.');

INSERT INTO pagos_reserva (id_reserva, monto, medio_pago, estado, referencia_pago)
VALUES
    (1, 58500.00, 'webpay', 'pagado', 'WBP-RES-2026-0001'),
    (2, 117600.00, 'tarjeta', 'pendiente', 'TRJ-RES-2026-0002'),
    (3, 112500.00, 'transferencia', 'pagado', 'TRF-RES-2026-0003');

INSERT INTO tickets_reserva (id_reserva, codigo_ticket, codigo_qr)
VALUES
    (1, 'TCK-2026-0001', 'QR-RES-2026-0001'),
    (2, 'TCK-2026-0002', 'QR-RES-2026-0002'),
    (3, 'TCK-2026-0003', 'QR-RES-2026-0003');