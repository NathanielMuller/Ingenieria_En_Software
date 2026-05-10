import { Router } from 'express';
import { getCatalogRooms, getAvailableRooms, getRoom } from '../controllers/roomController.js';

const router = Router();

router.get('/catalog', getCatalogRooms);
router.get('/availability', getAvailableRooms);
router.get('/:roomId', getRoom);

export { router as roomRouter };