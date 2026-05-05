import { Router } from 'express';
import { getAdminDashboard, patchAdminRoom, patchReservationStatus, postAdminRoom, removeAdminRoom, removeReservation } from '../controllers/adminController.js';

const router = Router();

router.get('/dashboard', getAdminDashboard);
router.patch('/reservations/:reservationCode/status', patchReservationStatus);
router.delete('/reservations/:reservationCode', removeReservation);
router.post('/rooms', postAdminRoom);
router.patch('/rooms/:roomId', patchAdminRoom);
router.delete('/rooms/:roomId', removeAdminRoom);

export { router as adminRouter };