import { Router } from 'express';
import { FormController } from './form.controller.js';
import { authenticate, validate } from '@core/middlewares/index.js';
import {
  createFormSchema,
  updateFormSchema,
  addBlockSchema,
  submitResponseSchema,
} from './form.validators.js';

const router = Router();

// Public routes for form submission
router.get('/slug/:slug', FormController.getFormBySlug);
router.get('/:formId/blocks', FormController.getBlocks);
router.post(
  '/slug/:slug/submit',
  validate(submitResponseSchema),
  FormController.submitResponse
);

// Protected routes (Form management)
router.use(authenticate);

router.post('/', validate(createFormSchema), FormController.createForm);
router.get('/', FormController.getForms);
router.get('/stats/dashboard', FormController.getDashboardStats);
router.get('/:id', FormController.getFormById);
router.get('/:formId/stats', FormController.getFormStats);
router.get('/:formId/responses', FormController.getResponses);
router.post(
  '/:formId/responses/bulk-delete',
  FormController.bulkDeleteResponses
);
router.patch(
  '/:formId/responses/bulk-update',
  FormController.bulkUpdateResponses
);
router.patch('/responses/:responseId', FormController.updateResponse);
router.patch('/:id', validate(updateFormSchema), FormController.updateForm);
router.delete('/:id', FormController.deleteForm);

// Block management
router.post(
  '/:formId/blocks',
  validate(addBlockSchema),
  FormController.addBlock
);
router.patch(
  '/blocks/:blockId',
  validate(addBlockSchema.partial()),
  FormController.updateBlock
);
router.delete('/blocks/:blockId', FormController.deleteBlock);

export default router;
