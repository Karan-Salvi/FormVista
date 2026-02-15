import { Router } from 'express';
import { AuthController } from './user.controller.js';
import { authenticate } from '@core/middlewares/index.js';
import { validate } from '@core/middlewares/validate.middleware.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from './user.validators.js';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/verify-email', AuthController.verifyEmail);
router.post(
  '/forgot-password',
  validate(forgotPasswordSchema),
  AuthController.forgotPassword
);
router.post(
  '/reset-password',
  validate(resetPasswordSchema),
  AuthController.resetPassword
);

// Protected routes
router.get('/me', authenticate, AuthController.getCurrentUser);
router.post(
  '/resend-verification',
  authenticate,
  AuthController.resendVerification
);

export default router;
