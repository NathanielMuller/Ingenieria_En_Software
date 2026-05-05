import { getStaffOverview } from '../repositories/reservationRepository.js';

export async function getOperationalOverview() {
  return getStaffOverview();
}