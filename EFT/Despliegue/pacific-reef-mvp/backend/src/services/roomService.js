import { findAvailableRooms, findCatalogRooms, findRoomById, isRoomAvailable } from '../repositories/roomRepository.js';
import { differenceInDays, formatCurrency, parseIsoDate } from '../utils/dateUtils.js';
import { HttpError } from '../utils/HttpError.js';

function buildRoomSummary(room, checkIn, checkOut) {
  const totalDays = differenceInDays(checkIn, checkOut);
  const price = Number(room.precio || 0);
  const totalAmount = totalDays > 0 ? price * totalDays : price;
  const reservationAmount = Math.round(totalAmount * 0.3);

  return {
    ...room,
    precio: price,
    totalDias: totalDays,
    montoTotal: totalAmount,
    montoReserva: reservationAmount,
    precioFormateado: formatCurrency(price),
    montoTotalFormateado: formatCurrency(totalAmount),
    montoReservaFormateado: formatCurrency(reservationAmount)
  };
}

export async function getAvailability({ checkIn, checkOut, guests = 1, category, maxPrice }) {
  const parsedCheckIn = parseIsoDate(checkIn);
  const parsedCheckOut = parseIsoDate(checkOut);
  const totalDays = differenceInDays(checkIn, checkOut);
  const guestCount = Number(guests || 1);

  if (!parsedCheckIn || !parsedCheckOut || totalDays <= 0) {
    throw new HttpError(400, 'Debes ingresar un rango de fechas valido.');
  }

  if (guestCount <= 0) {
    throw new HttpError(400, 'La cantidad de huespedes debe ser mayor a cero.');
  }

  const rooms = await findAvailableRooms({
    checkIn,
    checkOut,
    guests: guestCount,
    category: category || null,
    maxPrice: maxPrice ? Number(maxPrice) : null
  });

  return rooms.map((room) => buildRoomSummary(room, checkIn, checkOut));
}

export async function getRoomCatalog({ category, maxPrice } = {}) {
  const rooms = await findCatalogRooms({
    category: category || null,
    maxPrice: maxPrice ? Number(maxPrice) : null
  });

  return rooms.map((room) => ({
    ...room,
    precio: Number(room.precio || 0),
    totalDias: 1,
    precioFormateado: formatCurrency(Number(room.precio || 0))
  }));
}

export async function getRoomDetail({ roomId, checkIn, checkOut }) {
  const room = await findRoomById(roomId, checkIn || null);

  if (!room) {
    throw new HttpError(404, 'Habitacion no encontrada.');
  }

  const detail = {
    ...room,
    precio: Number(room.precio || 0),
    imagenes: room.imagenes ? room.imagenes.split('||').filter(Boolean) : [],
    equipamientos: room.equipamientos ? room.equipamientos.split('||').filter(Boolean) : []
  };

  if (!checkIn || !checkOut) {
    return {
      ...detail,
      disponibilidad: room.estado === 'disponible',
      precioFormateado: formatCurrency(detail.precio)
    };
  }

  const disponible = await isRoomAvailable({ roomId, checkIn, checkOut });
  return {
    ...buildRoomSummary(detail, checkIn, checkOut),
    disponibilidad: disponible
  };
}