import QRCode from 'qrcode';
import { findClientByUserId } from '../repositories/userRepository.js';
import { createReservationRecord, findReservationByCode } from '../repositories/reservationRepository.js';
import { findRoomById, isRoomAvailable } from '../repositories/roomRepository.js';
import { buildReservationCode, buildTicketCode } from '../utils/reservationCodes.js';
import { differenceInDays, formatCurrency, parseIsoDate } from '../utils/dateUtils.js';
import { HttpError } from '../utils/HttpError.js';

export async function createReservation({
  userId,
  roomId,
  checkIn,
  checkOut,
  guests,
  paymentMethod,
  observations
}) {
  if (!userId) {
    throw new HttpError(401, 'Debes iniciar sesion como cliente para reservar.');
  }

  const client = await findClientByUserId(userId);
  if (!client) {
    throw new HttpError(403, 'La cuenta actual no tiene perfil de cliente para reservar.');
  }

  const parsedCheckIn = parseIsoDate(checkIn);
  const parsedCheckOut = parseIsoDate(checkOut);
  const totalDays = differenceInDays(checkIn, checkOut);
  const guestCount = Number(guests || 1);

  if (!parsedCheckIn || !parsedCheckOut || totalDays <= 0) {
    throw new HttpError(400, 'Debes ingresar fechas validas para la reserva.');
  }

  if (!roomId || guestCount <= 0 || !paymentMethod) {
    throw new HttpError(400, 'Faltan datos obligatorios para confirmar la reserva.');
  }

  const room = await findRoomById(roomId, checkIn);
  if (!room) {
    throw new HttpError(404, 'La habitacion seleccionada no existe.');
  }

  if (guestCount > room.capacidad) {
    throw new HttpError(400, 'La habitacion no soporta esa cantidad de huespedes.');
  }

  const available = await isRoomAvailable({ roomId, checkIn, checkOut });
  if (!available) {
    throw new HttpError(409, 'La habitacion ya no esta disponible para esas fechas.');
  }

  const nightlyRate = Number(room.precio || 0);
  const totalAmount = nightlyRate * totalDays;
  const reservationAmount = Math.round(totalAmount * 0.3);
  const reservationCode = buildReservationCode();
  const ticketCode = buildTicketCode();
  const paymentReference = `MVP-${reservationCode}`;
  const qrPayload = JSON.stringify({
    reservationCode,
    ticketCode,
    roomId,
    checkIn,
    checkOut,
    clientEmail: client.correo
  });
  const qrCode = await QRCode.toDataURL(qrPayload);

  const createdReservation = await createReservationRecord({
    reservationCode,
    clientId: client.clientId,
    roomId,
    checkIn,
    checkOut,
    totalDays,
    guests: guestCount,
    totalAmount,
    reservationAmount,
    paymentMethod,
    paymentStatus: 'pagado',
    paymentReference,
    ticketCode,
    qrCode,
    observations
  });

  return {
    ...createdReservation,
    roomName: room.nombre,
    clientName: `${client.nombre} ${client.apellido}`,
    clientEmail: client.correo,
    checkIn,
    checkOut,
    totalDays,
    guests: guestCount,
    totalAmount,
    reservationAmount,
    totalAmountFormatted: formatCurrency(totalAmount),
    reservationAmountFormatted: formatCurrency(reservationAmount)
  };
}

export async function getReservationConfirmation(reservationCode) {
  const reservation = await findReservationByCode(reservationCode);

  if (!reservation) {
    throw new HttpError(404, 'No se encontro la reserva solicitada.');
  }

  return {
    ...reservation,
    montoTotal: Number(reservation.montoTotal || 0),
    montoReserva: Number(reservation.montoReserva || 0),
    montoTotalFormateado: formatCurrency(reservation.montoTotal),
    montoReservaFormateado: formatCurrency(reservation.montoReserva)
  };
}