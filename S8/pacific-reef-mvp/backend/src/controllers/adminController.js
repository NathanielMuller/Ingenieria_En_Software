import { asyncHandler } from '../utils/asyncHandler.js';
import { changeReservationStatus, createAdminRoom, deleteAdminReservation, deleteAdminRoom, getDashboardData, updateAdminRoom } from '../services/adminService.js';

export const getAdminDashboard = asyncHandler(async (request, response) => {
  const dashboard = await getDashboardData();

  response.json({
    success: true,
    data: dashboard
  });
});

export const patchReservationStatus = asyncHandler(async (request, response) => {
  const result = await changeReservationStatus(request.params.reservationCode, request.body.status);

  response.json({
    success: true,
    data: result
  });
});

export const removeReservation = asyncHandler(async (request, response) => {
  const result = await deleteAdminReservation(request.params.reservationCode);

  response.json({
    success: true,
    data: result
  });
});

export const postAdminRoom = asyncHandler(async (request, response) => {
  const result = await createAdminRoom(request.body);

  response.status(201).json({
    success: true,
    data: result
  });
});

export const patchAdminRoom = asyncHandler(async (request, response) => {
  const result = await updateAdminRoom(request.params.roomId, request.body);

  response.json({
    success: true,
    data: result
  });
});

export const removeAdminRoom = asyncHandler(async (request, response) => {
  const result = await deleteAdminRoom(request.params.roomId);

  response.json({
    success: true,
    data: result
  });
});