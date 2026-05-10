import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash) {
    return false;
  }

  return bcrypt.compare(password, storedHash);
}

export const demoCredentials = {
  admin: {
    email: 'admin@pacificreef.cl',
    password: 'Admin123*'
  },
  trabajador: {
    email: 'trabajador@pacificreef.cl',
    password: 'Trabajador123*'
  },
  cliente: {
    email: 'ana.paredes@email.com',
    password: 'Cliente123*'
  }
};