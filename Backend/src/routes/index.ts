import { Router, Request, Response } from 'express';
import { userRoutes } from '@/modules/user/index.js';
import { appConfig } from '@config/index.js';
const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'FormVista Backend API',
    version: appConfig.api.version,
    endpoints: {
      user: '/api/user',
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

router.use('/user', userRoutes);

export default router;
