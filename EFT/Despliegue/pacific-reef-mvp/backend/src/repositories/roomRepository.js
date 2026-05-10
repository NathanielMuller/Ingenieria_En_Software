import { pool } from '../config/database.js';

export async function findAvailableRooms({ checkIn, checkOut, guests, category, maxPrice }) {
  const parameters = [guests, checkIn, checkOut];
  let categoryClause = '';
  let priceClause = '';

  if (category) {
    categoryClause = 'AND ch.nombre = ?';
    parameters.push(category);
  }

  if (maxPrice) {
    priceClause = 'AND ph.valor_diario <= ?';
    parameters.push(maxPrice);
  }

  const [rows] = await pool.execute(
    `
      SELECT
        h.id_habitacion AS id,
        h.numero,
        h.nombre,
        h.capacidad,
        h.descripcion,
        h.estado,
        ch.nombre AS categoria,
        ph.valor_diario AS precio,
        ih.url_imagen AS imagen,
        GROUP_CONCAT(DISTINCT e.nombre ORDER BY e.nombre SEPARATOR ', ') AS equipamientos
      FROM habitaciones h
      INNER JOIN categorias_habitacion ch ON ch.id_categoria = h.id_categoria
      LEFT JOIN precios_habitacion ph
        ON ph.id_habitacion = h.id_habitacion
        AND ph.estado = 'vigente'
        AND ph.fecha_inicio <= ?
        AND (ph.fecha_fin IS NULL OR ph.fecha_fin >= ?)
      LEFT JOIN imagenes_habitacion ih
        ON ih.id_habitacion = h.id_habitacion
        AND ih.es_principal = TRUE
      LEFT JOIN habitacion_equipamiento he ON he.id_habitacion = h.id_habitacion
      LEFT JOIN equipamientos e ON e.id_equipamiento = he.id_equipamiento
      WHERE h.estado = 'disponible'
        AND h.capacidad >= ?
        AND NOT EXISTS (
          SELECT 1
          FROM reservas r
          WHERE r.id_habitacion = h.id_habitacion
            AND r.estado IN ('pendiente', 'confirmada')
            AND ? < r.fecha_salida
            AND ? > r.fecha_entrada
        )
        ${categoryClause}
        ${priceClause}
      GROUP BY h.id_habitacion, ch.nombre, ph.valor_diario, ih.url_imagen
      ORDER BY ph.valor_diario ASC, h.nombre ASC
    `,
    [checkIn, checkOut, ...parameters]
  );

  return rows;
}

export async function findCatalogRooms({ category, maxPrice } = {}) {
  const parameters = [];
  const today = new Date().toISOString().slice(0, 10);
  let categoryClause = '';
  let priceClause = '';

  if (category) {
    categoryClause = 'AND ch.nombre = ?';
    parameters.push(category);
  }

  if (maxPrice) {
    priceClause = 'AND ph.valor_diario <= ?';
    parameters.push(maxPrice);
  }

  const [rows] = await pool.execute(
    `
      SELECT
        h.id_habitacion AS id,
        h.numero,
        h.nombre,
        h.capacidad,
        h.descripcion,
        h.estado,
        ch.nombre AS categoria,
        ph.valor_diario AS precio,
        ih.url_imagen AS imagen,
        GROUP_CONCAT(DISTINCT e.nombre ORDER BY e.nombre SEPARATOR ', ') AS equipamientos
      FROM habitaciones h
      INNER JOIN categorias_habitacion ch ON ch.id_categoria = h.id_categoria
      LEFT JOIN precios_habitacion ph
        ON ph.id_habitacion = h.id_habitacion
        AND ph.estado = 'vigente'
        AND ph.fecha_inicio <= ?
        AND (ph.fecha_fin IS NULL OR ph.fecha_fin >= ?)
      LEFT JOIN imagenes_habitacion ih
        ON ih.id_habitacion = h.id_habitacion
        AND ih.es_principal = TRUE
      LEFT JOIN habitacion_equipamiento he ON he.id_habitacion = h.id_habitacion
      LEFT JOIN equipamientos e ON e.id_equipamiento = he.id_equipamiento
      WHERE h.estado = 'disponible'
        ${categoryClause}
        ${priceClause}
      GROUP BY h.id_habitacion, ch.nombre, ph.valor_diario, ih.url_imagen
      ORDER BY ph.valor_diario ASC, h.nombre ASC
    `,
    [today, today, ...parameters]
  );

  return rows;
}

export async function findRoomById(roomId, effectiveDate = null) {
  const priceDate = effectiveDate || new Date().toISOString().slice(0, 10);
  const [rows] = await pool.execute(
    `
      SELECT
        h.id_habitacion AS id,
        h.numero,
        h.nombre,
        h.capacidad,
        h.descripcion,
        h.estado,
        ch.nombre AS categoria,
        ch.descripcion AS categoriaDescripcion,
        ph.valor_diario AS precio,
        GROUP_CONCAT(DISTINCT ih.url_imagen ORDER BY ih.es_principal DESC, ih.id_imagen ASC SEPARATOR '||') AS imagenes,
        GROUP_CONCAT(DISTINCT e.nombre ORDER BY e.nombre ASC SEPARATOR '||') AS equipamientos
      FROM habitaciones h
      INNER JOIN categorias_habitacion ch ON ch.id_categoria = h.id_categoria
      LEFT JOIN precios_habitacion ph
        ON ph.id_habitacion = h.id_habitacion
        AND ph.estado = 'vigente'
        AND ph.fecha_inicio <= ?
        AND (ph.fecha_fin IS NULL OR ph.fecha_fin >= ?)
      LEFT JOIN imagenes_habitacion ih ON ih.id_habitacion = h.id_habitacion
      LEFT JOIN habitacion_equipamiento he ON he.id_habitacion = h.id_habitacion
      LEFT JOIN equipamientos e ON e.id_equipamiento = he.id_equipamiento
      WHERE h.id_habitacion = ?
      GROUP BY h.id_habitacion, ch.nombre, ch.descripcion, ph.valor_diario
      LIMIT 1
    `,
    [priceDate, priceDate, roomId]
  );

  return rows[0] || null;
}

export async function isRoomAvailable({ roomId, checkIn, checkOut }) {
  const [rows] = await pool.execute(
    `
      SELECT 1
      FROM habitaciones h
      WHERE h.id_habitacion = ?
        AND h.estado = 'disponible'
        AND NOT EXISTS (
          SELECT 1
          FROM reservas r
          WHERE r.id_habitacion = h.id_habitacion
            AND r.estado IN ('pendiente', 'confirmada')
            AND ? < r.fecha_salida
            AND ? > r.fecha_entrada
        )
      LIMIT 1
    `,
    [roomId, checkIn, checkOut]
  );

  return rows.length > 0;
}

export async function findRoomCategories() {
  const [rows] = await pool.execute(
    `
      SELECT id_categoria AS id, nombre, descripcion
      FROM categorias_habitacion
      ORDER BY nombre ASC
    `
  );

  return rows;
}

export async function findRoomsForAdmin(limit = 10) {
  const safeLimit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 10;
  const [rows] = await pool.query(
    `
      SELECT
        h.id_habitacion AS id,
        h.id_categoria AS categoryId,
        h.numero,
        h.nombre,
        h.capacidad,
        h.descripcion,
        h.estado,
        ch.nombre AS categoria,
        ph.valor_diario AS precio,
        ih.url_imagen AS imagen
      FROM habitaciones h
      INNER JOIN categorias_habitacion ch ON ch.id_categoria = h.id_categoria
      LEFT JOIN precios_habitacion ph
        ON ph.id_habitacion = h.id_habitacion
        AND ph.estado = 'vigente'
        AND ph.fecha_fin IS NULL
      LEFT JOIN imagenes_habitacion ih
        ON ih.id_habitacion = h.id_habitacion
        AND ih.es_principal = TRUE
      ORDER BY h.fecha_creacion DESC, h.id_habitacion DESC
      LIMIT ${safeLimit}
    `
  );

  return rows;
}

export async function createRoomWithPrice({
  categoryId,
  number,
  name,
  capacity,
  description,
  status,
  price,
  imageUrl,
  imageAlt
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [roomResult] = await connection.execute(
      `
        INSERT INTO habitaciones (id_categoria, numero, nombre, capacidad, descripcion, estado)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [categoryId, number, name, capacity, description, status]
    );

    const roomId = roomResult.insertId;

    await connection.execute(
      `
        INSERT INTO precios_habitacion (id_habitacion, valor_diario, fecha_inicio, fecha_fin, estado)
        VALUES (?, ?, CURRENT_DATE(), NULL, 'vigente')
      `,
      [roomId, price]
    );

    if (imageUrl) {
      await connection.execute(
        `
          INSERT INTO imagenes_habitacion (id_habitacion, url_imagen, texto_alternativo, es_principal)
          VALUES (?, ?, ?, TRUE)
        `,
        [roomId, imageUrl, imageAlt || `Vista principal ${name}`]
      );
    }

    await connection.commit();
    return roomId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function updateRoomWithPrice({
  roomId,
  categoryId,
  number,
  name,
  capacity,
  description,
  status,
  price,
  imageUrl,
  imageAlt
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [roomUpdate] = await connection.execute(
      `
        UPDATE habitaciones
        SET id_categoria = ?,
            numero = ?,
            nombre = ?,
            capacidad = ?,
            descripcion = ?,
            estado = ?
        WHERE id_habitacion = ?
      `,
      [categoryId, number, name, capacity, description, status, roomId]
    );

    if (roomUpdate.affectedRows === 0) {
      return false;
    }

    const [priceUpdate] = await connection.execute(
      `
        UPDATE precios_habitacion
        SET valor_diario = ?,
            fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_habitacion = ?
          AND estado = 'vigente'
          AND fecha_fin IS NULL
      `,
      [price, roomId]
    );

    if (priceUpdate.affectedRows === 0) {
      await connection.execute(
        `
          INSERT INTO precios_habitacion (id_habitacion, valor_diario, fecha_inicio, fecha_fin, estado)
          VALUES (?, ?, CURRENT_DATE(), NULL, 'vigente')
        `,
        [roomId, price]
      );
    }

    if (imageUrl) {
      const [imageUpdate] = await connection.execute(
        `
          UPDATE imagenes_habitacion
          SET url_imagen = ?,
              texto_alternativo = ?
          WHERE id_habitacion = ?
            AND es_principal = TRUE
        `,
        [imageUrl, imageAlt || `Vista principal ${name}`, roomId]
      );

      if (imageUpdate.affectedRows === 0) {
        await connection.execute(
          `
            INSERT INTO imagenes_habitacion (id_habitacion, url_imagen, texto_alternativo, es_principal)
            VALUES (?, ?, ?, TRUE)
          `,
          [roomId, imageUrl, imageAlt || `Vista principal ${name}`]
        );
      }
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function deleteRoom(roomId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      'DELETE FROM imagenes_habitacion WHERE id_habitacion = ?',
      [roomId]
    );
    await connection.execute(
      'DELETE FROM habitacion_equipamiento WHERE id_habitacion = ?',
      [roomId]
    );
    await connection.execute(
      'DELETE FROM precios_habitacion WHERE id_habitacion = ?',
      [roomId]
    );
    const [result] = await connection.execute(
      'DELETE FROM habitaciones WHERE id_habitacion = ?',
      [roomId]
    );

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}