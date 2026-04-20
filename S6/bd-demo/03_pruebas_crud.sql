USE pacific_reef_reservas;

-- PRUEBA 1: CREATE
-- Crear un nuevo cliente y una nueva reserva para evidenciar alta de datos.

INSERT INTO usuarios (id_rol, nombre, apellido, correo, clave_hash, idioma, estado)
VALUES (1, 'Daniela', 'Herrera', 'daniela.herrera@email.com', 'hash_cliente_04', 'es', 'activo');

INSERT INTO clientes (id_usuario, telefono, documento)
VALUES (LAST_INSERT_ID(), '+56944445555', '20333444-5');

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
VALUES (
    'RES-2026-0004',
    LAST_INSERT_ID(),
    2,
    '2026-08-12',
    '2026-08-15',
    3,
    2,
    204000.00,
    61200.00,
    'pendiente',
    'Reserva creada para prueba CRUD de semana 6.'
);

INSERT INTO pagos_reserva (id_reserva, monto, medio_pago, estado, referencia_pago)
VALUES (LAST_INSERT_ID(), 61200.00, 'webpay', 'pendiente', 'WBP-RES-2026-0004');

INSERT INTO tickets_reserva (id_reserva, codigo_ticket, codigo_qr)
VALUES (
    (SELECT id_reserva FROM reservas WHERE codigo_reserva = 'RES-2026-0004'),
    'TCK-2026-0004',
    'QR-RES-2026-0004'
);

SELECT 'CREATE - Reserva creada' AS prueba, r.id_reserva, r.codigo_reserva, r.estado, r.monto_total, r.monto_reserva
FROM reservas r
WHERE r.codigo_reserva = 'RES-2026-0004';

-- PRUEBA 2: READ
-- Consultar una reserva junto a cliente, habitacion, pago y ticket.

SELECT
    r.id_reserva,
    r.codigo_reserva,
    CONCAT(u.nombre, ' ', u.apellido) AS cliente,
    h.nombre AS habitacion,
    r.fecha_entrada,
    r.fecha_salida,
    r.cantidad_huespedes,
    r.monto_total,
    p.estado AS estado_pago,
    t.codigo_ticket,
    r.estado AS estado_reserva
FROM reservas r
INNER JOIN clientes c ON c.id_cliente = r.id_cliente
INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
INNER JOIN habitaciones h ON h.id_habitacion = r.id_habitacion
LEFT JOIN pagos_reserva p ON p.id_reserva = r.id_reserva
LEFT JOIN tickets_reserva t ON t.id_reserva = r.id_reserva
WHERE r.codigo_reserva = 'RES-2026-0004';

-- PRUEBA 3: UPDATE
-- Confirmar la reserva y dejar el pago como pagado.

UPDATE reservas
SET estado = 'confirmada',
    observaciones = 'Reserva confirmada durante prueba CRUD.'
WHERE codigo_reserva = 'RES-2026-0004';

UPDATE pagos_reserva
SET estado = 'pagado',
    referencia_pago = 'WBP-RES-2026-0004-OK'
WHERE id_reserva = (
    SELECT id_reserva
    FROM reservas
    WHERE codigo_reserva = 'RES-2026-0004'
);

SELECT
    r.codigo_reserva,
    r.estado AS estado_reserva,
    p.estado AS estado_pago,
    p.referencia_pago
FROM reservas r
INNER JOIN pagos_reserva p ON p.id_reserva = r.id_reserva
WHERE r.codigo_reserva = 'RES-2026-0004';

-- PRUEBA 4: DELETE LOGICO
-- Cancelar la reserva sin borrar el historico.

UPDATE reservas
SET estado = 'cancelada',
    motivo_cancelacion = 'Cancelacion registrada para demostrar borrado logico.',
    fecha_cancelacion = NOW()
WHERE codigo_reserva = 'RES-2026-0004';

SELECT
    codigo_reserva,
    estado,
    motivo_cancelacion,
    fecha_cancelacion
FROM reservas
WHERE codigo_reserva = 'RES-2026-0004';

-- CONSULTA EXTRA
-- Habitaciones disponibles con precio vigente para reforzar la relacion con el flujo del negocio.

SELECT
    h.id_habitacion,
    h.numero,
    h.nombre,
    h.capacidad,
    ph.valor_diario
FROM habitaciones h
INNER JOIN precios_habitacion ph ON ph.id_habitacion = h.id_habitacion
WHERE h.estado = 'disponible'
  AND ph.estado = 'vigente'
ORDER BY h.numero;