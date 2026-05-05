import { asyncHandler } from '../utils/asyncHandler.js';
import { createReservation, getReservationConfirmation } from '../services/reservationService.js';

export const postReservation = asyncHandler(async (request, response) => {
  const reservation = await createReservation(request.body);

  response.status(201).json({
    success: true,
    data: reservation
  });
});

export const getReservationByCode = asyncHandler(async (request, response) => {
  const reservation = await getReservationConfirmation(request.params.reservationCode);

  response.json({
    success: true,
    data: reservation
  });
});