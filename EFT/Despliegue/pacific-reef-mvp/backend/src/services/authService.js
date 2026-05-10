import { HttpError } from '../utils/HttpError.js';
import { hashPassword, verifyPassword } from '../utils/passwordUtils.js';
import { createClientAccount, emailExists, findUserByEmailAndRole } from '../repositories/userRepository.js';

const validRoles = new Set(['cliente', 'administrador', 'trabajador']);

function buildUserPayload(user) {
  return {
    id: user.id,
    nombre: user.nombre,
    apellido: user.apellido,
    correo: user.correo,
    idioma: user.idioma,
    role: user.role,
    clientId: user.clientId || null,
    workerId: user.workerId || null
  };
}

export async function login({ email, password, role }) {
  if (!email || !password || !validRoles.has(role)) {
    throw new HttpError(400, 'Debes indicar correo, contrasena y perfil valido.');
  }

  const user = await findUserByEmailAndRole(email, role);

  if (!user) {
    throw new HttpError(401, 'Credenciales invalidas.');
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, 'Credenciales invalidas.');
  }

  return {
    user: buildUserPayload(user),
    redirectTo: role === 'administrador' ? '/admin.html' : role === 'trabajador' ? '/trabajador.html' : '/reserva.html'
  };
}

export async function registerClient({ nombre, apellido, correo, password, telefono, documento }) {
  if (!nombre || !apellido || !correo || !password) {
    throw new HttpError(400, 'Nombre, apellido, correo y contrasena son obligatorios.');
  }

  if (password.length < 8) {
    throw new HttpError(400, 'La contrasena debe tener al menos 8 caracteres.');
  }

  if (await emailExists(correo)) {
    throw new HttpError(409, 'Ya existe una cuenta registrada con ese correo.');
  }

  const passwordHash = await hashPassword(password);
  const user = await createClientAccount({
    nombre,
    apellido,
    correo,
    passwordHash,
    telefono,
    documento
  });

  return {
    user,
    redirectTo: '/reserva.html'
  };
}