import { Router } from 'express';
import { getWeather } from '../controllers/externalController.js';

const router = Router();

router.get('/weather', getWeather);

export { router as externalRouter };