import { Router } from 'express';
import { getReservationByCode, postReservation } from '../controllers/reservationController.js';

const router = Router();

router.post('/', postReservation);
router.get('/:reservationCode', getReservationByCode);

export { router as reservationRouter };