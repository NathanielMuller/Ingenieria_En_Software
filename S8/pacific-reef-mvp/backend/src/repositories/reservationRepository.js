import { pool } from '../config/database.js';

export async function createReservationRecord({
  reservationCode,
  clientId,
  roomId,
  checkIn,
  checkOut,
  totalDays,
  guests,
  totalAmount,
  reservationAmount,
  paymentMethod,
  paymentStatus,
  paymentReference,
  ticketCode,
  qrCode,
  observations
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [reservationResult] = await connection.execute(
      `
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
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmada', ?)
      `,
      [
        reservationCode,
        clientId,
        roomId,
        checkIn,
        checkOut,
        totalDays,
        guests,
        totalAmount,
        reservationAmount,
        observations || null
      ]
    );

    await connection.execute(
      `
        INSERT INTO pagos_reserva (id_reserva, monto, medio_pago, estado, referencia_pago)
        VALUES (?, ?, ?, ?, ?)
      `,
      [reservationResult.insertId, reservationAmount, paymentMethod, paymentStatus, paymentReference]
    );

    await connection.execute(
      `
        INSERT INTO tickets_reserva (id_reserva, codigo_ticket, codigo_qr)
        VALUES (?, ?, ?)
      `,
      [reservationResult.insertId, ticketCode, qrCode]
    );

    await connection.commit();

    return {
      reservationId: reservationResult.insertId,
      reservationCode,
      ticketCode,
      qrCode
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function findReservationByCode(reservationCode) {
  const [rows] = await pool.execute(
    `
      SELECT
        r.id_reserva AS id,
        r.codigo_reserva AS codigoReserva,
        r.fecha_entrada AS fechaEntrada,
        r.fecha_salida AS fechaSalida,
        r.cantidad_dias AS cantidadDias,
        r.cantidad_huespedes AS cantidadHuespedes,
        r.monto_total AS montoTotal,
        r.monto_reserva AS montoReserva,
        r.estado,
        r.observaciones,
        h.nombre AS habitacion,
        h.numero AS numeroHabitacion,
        ch.nombre AS categoria,
        u.nombre AS nombreCliente,
        u.apellido AS apellidoCliente,
        u.correo,
        p.medio_pago AS medioPago,
        p.estado AS estadoPago,
        p.referencia_pago AS referenciaPago,
        t.codigo_ticket AS codigoTicket,
        t.codigo_qr AS codigoQr
      FROM reservas r
      INNER JOIN clientes c ON c.id_cliente = r.id_cliente
      INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
      INNER JOIN habitaciones h ON h.id_habitacion = r.id_habitacion
      INNER JOIN categorias_habitacion ch ON ch.id_categoria = h.id_categoria
      LEFT JOIN pagos_reserva p ON p.id_reserva = r.id_reserva
      LEFT JOIN tickets_reserva t ON t.id_reserva = r.id_reserva
      WHERE r.codigo_reserva = ?
      LIMIT 1
    `,
    [reservationCode]
  );

  return rows[0] || null;
}

export async function getDashboardMetrics() {
  const [[reservationsRow]] = await pool.execute(
    `
      SELECT
        COUNT(*) AS totalReservas,
        SUM(CASE WHEN estado IN ('pendiente', 'confirmada') THEN 1 ELSE 0 END) AS reservasActivas,
        SUM(CASE WHEN fecha_entrada = CURRENT_DATE() THEN 1 ELSE 0 END) AS checkInHoy,
        SUM(CASE WHEN estado = 'confirmada' THEN monto_total ELSE 0 END) AS ingresosConfirmados
      FROM reservas
    `
  );

  const [[occupancyRow]] = await pool.execute(
    `
      SELECT
        ROUND(
          (
            SUM(
              CASE
                WHEN EXISTS (
                  SELECT 1
                  FROM reservas r
                  WHERE r.id_habitacion = h.id_habitacion
                    AND r.estado IN ('pendiente', 'confirmada')
                    AND CURRENT_DATE() >= r.fecha_entrada
                    AND CURRENT_DATE() < r.fecha_salida
                ) THEN 1 ELSE 0
              END
            ) / NULLIF(COUNT(*), 0)
          ) * 100,
          0
        ) AS ocupacion
      FROM habitaciones h
      WHERE h.estado IN ('disponible', 'ocupada')
    `
  );

  return {
    totalReservas: Number(reservationsRow.totalReservas || 0),
    reservasActivas: Number(reservationsRow.reservasActivas || 0),
    checkInHoy: Number(reservationsRow.checkInHoy || 0),
    ingresosConfirmados: Number(reservationsRow.ingresosConfirmados || 0),
    ocupacion: Number(occupancyRow.ocupacion || 0)
  };
}

export async function getRecentReservations(limit = 10) {
  const safeLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  const [rows] = await pool.query(
    `
      SELECT
        r.codigo_reserva AS codigoReserva,
        CONCAT(u.nombre, ' ', u.apellido) AS cliente,
        DATE_FORMAT(r.fecha_entrada, '%Y-%m-%d') AS fechaEntrada,
        DATE_FORMAT(r.fecha_salida, '%Y-%m-%d') AS fechaSalida,
        r.estado,
        h.nombre AS habitacion
      FROM reservas r
      INNER JOIN clientes c ON c.id_cliente = r.id_cliente
      INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
      INNER JOIN habitaciones h ON h.id_habitacion = r.id_habitacion
      ORDER BY r.fecha_creacion DESC
      LIMIT ${safeLimit}
    `
  );

  return rows;
}

export async function updateReservationStatus(reservationCode, nextStatus) {
  const [result] = await pool.execute(
    `
      UPDATE reservas
      SET estado = ?,
          motivo_cancelacion = CASE WHEN ? = 'cancelada' THEN COALESCE(motivo_cancelacion, 'Actualizada desde panel admin') ELSE NULL END,
          fecha_cancelacion = CASE WHEN ? = 'cancelada' THEN NOW() ELSE NULL END
      WHERE codigo_reserva = ?
    `,
    [nextStatus, nextStatus, nextStatus, reservationCode]
  );

  return result.affectedRows > 0;
}

export async function getStaffOverview() {
  const [reservationsToday] = await pool.execute(
    `
      SELECT
        r.codigo_reserva AS codigoReserva,
        CONCAT(u.nombre, ' ', u.apellido) AS cliente,
        h.nombre AS habitacion,
        r.observaciones,
        DATE_FORMAT(r.fecha_entrada, '%Y-%m-%d') AS fechaEntrada,
        DATE_FORMAT(r.fecha_salida, '%Y-%m-%d') AS fechaSalida,
        r.estado
      FROM reservas r
      INNER JOIN clientes c ON c.id_cliente = r.id_cliente
      INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
      INNER JOIN habitaciones h ON h.id_habitacion = r.id_habitacion
      WHERE CURRENT_DATE() >= r.fecha_entrada
        AND CURRENT_DATE() < r.fecha_salida
        AND r.estado IN ('pendiente', 'confirmada')
      ORDER BY r.fecha_entrada ASC
      LIMIT 6
    `
  );

  const [upcomingDays] = await pool.execute(
    `
      SELECT
        DATE_FORMAT(d.fecha, '%Y-%m-%d') AS fecha,
        DAYNAME(d.fecha) AS dia,
        COUNT(r.id_reserva) AS reservas
      FROM (
        SELECT CURRENT_DATE() AS fecha
        UNION ALL SELECT DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY)
        UNION ALL SELECT DATE_ADD(CURRENT_DATE(), INTERVAL 2 DAY)
        UNION ALL SELECT DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY)
        UNION ALL SELECT DATE_ADD(CURRENT_DATE(), INTERVAL 4 DAY)
        UNION ALL SELECT DATE_ADD(CURRENT_DATE(), INTERVAL 5 DAY)
        UNION ALL SELECT DATE_ADD(CURRENT_DATE(), INTERVAL 6 DAY)
      ) d
      LEFT JOIN reservas r
        ON d.fecha >= r.fecha_entrada
       AND d.fecha < r.fecha_salida
       AND r.estado IN ('pendiente', 'confirmada')
      GROUP BY d.fecha, DAYNAME(d.fecha)
      ORDER BY d.fecha ASC
    `
  );

  return {
    reservationsToday,
    upcomingDays
  };
}

export async function deleteReservationByCode(reservationCode) {
  const [result] = await pool.execute(
    'DELETE FROM reservas WHERE codigo_reserva = ?',
    [reservationCode]
  );

  return result.affectedRows > 0;
}