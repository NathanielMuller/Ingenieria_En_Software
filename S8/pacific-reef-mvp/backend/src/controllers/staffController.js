import { asyncHandler } from '../utils/asyncHandler.js';
import { getOperationalOverview } from '../services/staffService.js';

export const getStaffDashboard = asyncHandler(async (request, response) => {
  const overview = await getOperationalOverview();

  response.json({
    success: true,
    data: overview
  });
});