import { pool } from '../config/database.js';

export async function findUserByEmailAndRole(email, roleName) {
  const [rows] = await pool.execute(
    `
      SELECT
        u.id_usuario AS id,
        u.nombre,
        u.apellido,
        u.correo,
        u.clave_hash AS passwordHash,
        u.idioma,
        u.estado,
        r.nombre AS role,
        c.id_cliente AS clientId,
        t.id_trabajador AS workerId
      FROM usuarios u
      INNER JOIN roles r ON r.id_rol = u.id_rol
      LEFT JOIN clientes c ON c.id_usuario = u.id_usuario
      LEFT JOIN trabajadores t ON t.id_usuario = u.id_usuario
      WHERE u.correo = ? AND r.nombre = ?
      LIMIT 1
    `,
    [email, roleName]
  );

  return rows[0] || null;
}

export async function findClientByUserId(userId) {
  const [rows] = await pool.execute(
    `
      SELECT c.id_cliente AS clientId, u.nombre, u.apellido, u.correo, c.telefono, c.documento
      FROM clientes c
      INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
      WHERE c.id_usuario = ?
      LIMIT 1
    `,
    [userId]
  );

  return rows[0] || null;
}

export async function emailExists(email) {
  const [rows] = await pool.execute(
    'SELECT 1 FROM usuarios WHERE correo = ? LIMIT 1',
    [email]
  );

  return rows.length > 0;
}

export async function createClientAccount({ nombre, apellido, correo, passwordHash, telefono, documento }) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [roleRows] = await connection.execute(
      'SELECT id_rol FROM roles WHERE nombre = ? LIMIT 1',
      ['cliente']
    );

    const clientRoleId = roleRows[0]?.id_rol;

    const [userResult] = await connection.execute(
      `
        INSERT INTO usuarios (id_rol, nombre, apellido, correo, clave_hash, idioma, estado)
        VALUES (?, ?, ?, ?, ?, 'es', 'activo')
      `,
      [clientRoleId, nombre, apellido, correo, passwordHash]
    );

    const [clientResult] = await connection.execute(
      `
        INSERT INTO clientes (id_usuario, telefono, documento)
        VALUES (?, ?, ?)
      `,
      [userResult.insertId, telefono || null, documento || null]
    );

    await connection.commit();

    return {
      userId: userResult.insertId,
      clientId: clientResult.insertId,
      nombre,
      apellido,
      correo,
      telefono: telefono || null,
      documento: documento || null,
      role: 'cliente'
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}