import { Router } from 'express';
import { TemplateController } from './template.controller.js';
import {
  authenticate,
  requireRole,
} from '@core/middlewares/auth.middleware.js';

const router = Router();

/**
 * Public Routes
 */
router.get('/', authenticate, TemplateController.getTemplates);
router.get('/:id', authenticate, TemplateController.getTemplateById);

/**
 * User Routes
 */
router.post('/use', authenticate, TemplateController.createFormFromTemplate);

/**
 * Admin Routes
 */
router.post(
  '/',
  authenticate,
  requireRole('admin'),
  TemplateController.createTemplate
);
router.delete(
  '/:id',
  authenticate,
  requireRole('admin'),
  TemplateController.deleteTemplate
);

export default router;
