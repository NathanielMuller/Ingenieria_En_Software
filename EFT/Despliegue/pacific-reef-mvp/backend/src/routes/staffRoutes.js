import { Router } from 'express';
import { getStaffDashboard } from '../controllers/staffController.js';

const router = Router();

router.get('/dashboard', getStaffDashboard);

export { router as staffRouter };