import {Router} from 'express';
import {authRoutes} from './v1/auth';

export const apisRoutes = (): Router => {
  const router = Router();
  // Initialize  Router
  return router.use('/v1/auth', authRoutes());
};
