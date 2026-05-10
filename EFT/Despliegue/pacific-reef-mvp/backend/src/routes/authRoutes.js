import { Router } from 'express';
import { postLogin, postRegister } from '../controllers/authController.js';

const router = Router();

router.post('/login', postLogin);
router.post('/register', postRegister);

export { router as authRouter };