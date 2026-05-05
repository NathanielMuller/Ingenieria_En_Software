import { asyncHandler } from '../utils/asyncHandler.js';
import { getAvailability, getRoomCatalog, getRoomDetail } from '../services/roomService.js';

export const getCatalogRooms = asyncHandler(async (request, response) => {
  const rooms = await getRoomCatalog({
    category: request.query.category,
    maxPrice: request.query.maxPrice
  });

  response.json({
    success: true,
    data: rooms
  });
});

export const getAvailableRooms = asyncHandler(async (request, response) => {
  const rooms = await getAvailability({
    checkIn: request.query.checkIn,
    checkOut: request.query.checkOut,
    guests: request.query.guests,
    category: request.query.category,
    maxPrice: request.query.maxPrice
  });

  response.json({
    success: true,
    data: rooms
  });
});

export const getRoom = asyncHandler(async (request, response) => {
  const room = await getRoomDetail({
    roomId: request.params.roomId,
    checkIn: request.query.checkIn,
    checkOut: request.query.checkOut
  });

  response.json({
    success: true,
    data: room
  });
});