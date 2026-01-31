import { Router } from 'express';
import { AuthController } from './user.controller.js';
import { authenticate } from '@core/middlewares/index.js';
import { validate } from '@core/middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from './user.validators.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

// Protected routes
router.get('/me', authenticate, AuthController.getCurrentUser);

export default router;
