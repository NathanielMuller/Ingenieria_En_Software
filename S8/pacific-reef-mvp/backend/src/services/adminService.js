import { getDashboardMetrics, getRecentReservations, updateReservationStatus, deleteReservationByCode } from '../repositories/reservationRepository.js';
import { createRoomWithPrice, deleteRoom, findRoomCategories, findRoomsForAdmin, updateRoomWithPrice } from '../repositories/roomRepository.js';
import { HttpError } from '../utils/HttpError.js';
import { formatCurrency } from '../utils/dateUtils.js';

const allowedStatuses = new Set(['pendiente', 'confirmada', 'cancelada', 'finalizada']);
const allowedRoomStatuses = new Set(['disponible', 'ocupada', 'mantenimiento', 'inactiva']);

function validateAdminRoomPayload(payload) {
  const categoryId = Number(payload.categoryId);
  const capacity = Number(payload.capacity);
  const price = Number(payload.price);
  const number = String(payload.number || '').trim();
  const name = String(payload.name || '').trim();
  const description = String(payload.description || '').trim();
  const status = String(payload.status || 'disponible').trim();
  const imageUrl = String(payload.imageUrl || '').trim();

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new HttpError(400, 'Debes seleccionar una categoria valida.');
  }

  if (!number || !name) {
    throw new HttpError(400, 'Debes ingresar numero y nombre para la habitacion.');
  }

  if (!Number.isInteger(capacity) || capacity <= 0) {
    throw new HttpError(400, 'La capacidad debe ser un numero entero mayor a cero.');
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new HttpError(400, 'El precio diario debe ser mayor a cero.');
  }

  if (!allowedRoomStatuses.has(status)) {
    throw new HttpError(400, 'El estado de la habitacion no es valido.');
  }

  return {
    categoryId,
    capacity,
    price,
    number,
    name,
    description: description || null,
    status,
    imageUrl: imageUrl || null
  };
}

export async function getDashboardData() {
  const metrics = await getDashboardMetrics();
  const recentReservations = await getRecentReservations(8);
  const roomCategories = await findRoomCategories();
  const catalogRooms = await findRoomsForAdmin(8);

  return {
    metrics: {
      ...metrics,
      ingresosConfirmadosFormateado: formatCurrency(metrics.ingresosConfirmados)
    },
    recentReservations,
    roomCategories,
    catalogRooms: catalogRooms.map((room) => ({
      ...room,
      precio: Number(room.precio || 0),
      precioFormateado: formatCurrency(Number(room.precio || 0))
    }))
  };
}

export async function changeReservationStatus(reservationCode, nextStatus) {
  if (!allowedStatuses.has(nextStatus)) {
    throw new HttpError(400, 'El estado solicitado no es valido.');
  }

  const updated = await updateReservationStatus(reservationCode, nextStatus);
  if (!updated) {
    throw new HttpError(404, 'No se encontro la reserva a actualizar.');
  }

  return {
    reservationCode,
    nextStatus
  };
}

export async function createAdminRoom(payload) {
  const roomData = validateAdminRoomPayload(payload);

  try {
    const roomId = await createRoomWithPrice({
      ...roomData,
      imageAlt: `Vista principal ${roomData.name}`
    });

    return {
      roomId,
      number: roomData.number,
      name: roomData.name
    };
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, 'Ya existe una habitacion con ese numero.');
    }

    throw error;
  }
}

export async function updateAdminRoom(roomId, payload) {
  const normalizedRoomId = Number(roomId);
  if (!Number.isInteger(normalizedRoomId) || normalizedRoomId <= 0) {
    throw new HttpError(400, 'La habitacion a editar no es valida.');
  }

  const roomData = validateAdminRoomPayload(payload);

  try {
    const updated = await updateRoomWithPrice({
      roomId: normalizedRoomId,
      ...roomData,
      imageAlt: `Vista principal ${roomData.name}`
    });

    if (!updated) {
      throw new HttpError(404, 'No se encontro la habitacion a editar.');
    }

    return {
      roomId: normalizedRoomId,
      number: roomData.number,
      name: roomData.name
    };
  } catch (error) {
    if (error?.code === 'ER_DUP_ENTRY') {
      throw new HttpError(409, 'Ya existe una habitacion con ese numero.');
    }

    throw error;
  }
}

export async function deleteAdminRoom(roomId) {
  const normalizedRoomId = Number(roomId);
  if (!Number.isInteger(normalizedRoomId) || normalizedRoomId <= 0) {
    throw new HttpError(400, 'La habitacion a eliminar no es valida.');
  }

  try {
    const deleted = await deleteRoom(normalizedRoomId);

    if (!deleted) {
      throw new HttpError(404, 'No se encontro la habitacion a eliminar.');
    }

    return { roomId: normalizedRoomId };
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error?.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new HttpError(409, 'No se puede eliminar la habitacion porque tiene reservas asociadas.');
    }
    throw error;
  }
}

export async function deleteAdminReservation(reservationCode) {
  if (!reservationCode) {
    throw new HttpError(400, 'Codigo de reserva requerido.');
  }

  const deleted = await deleteReservationByCode(reservationCode);

  if (!deleted) {
    throw new HttpError(404, 'No se encontro la reserva a eliminar.');
  }

  return { reservationCode };
}