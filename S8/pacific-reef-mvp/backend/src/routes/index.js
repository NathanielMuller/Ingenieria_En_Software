import { Router } from 'express';
import { authRouter } from './authRoutes.js';
import { roomRouter } from './roomRoutes.js';
import { reservationRouter } from './reservationRoutes.js';
import { adminRouter } from './adminRoutes.js';
import { staffRouter } from './staffRoutes.js';
import { externalRouter } from './externalRoutes.js';
const demoCredentials = {
  admin: { email: 'admin@pacificreef.cl', password: 'Admin123*' },
  trabajador: { email: 'trabajador@pacificreef.cl', password: 'Trabajador123*' },
  cliente: { email: 'ana.paredes@email.com', password: 'Cliente123*' }
};

const router = Router();

router.get('/health', (request, response) => {
  response.json({
    success: true,
    message: 'Pacific Reef MVP backend operativo.',
    data: {
      demoCredentials
    }
  });
});

router.use('/auth', authRouter);
router.use('/rooms', roomRouter);
router.use('/reservations', reservationRouter);
router.use('/admin', adminRouter);
router.use('/staff', staffRouter);
router.use('/external', externalRouter);

export { router as apiRouter };