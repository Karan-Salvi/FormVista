import express, { Router } from 'express';
import { SubscriptionController } from './subscription.controller.js';
import { authenticate, validate } from '@core/middlewares/index.js';
import { createCheckoutSessionSchema } from './subscription.validators.js';

const router = Router();

// Public routes
router.get('/plans', SubscriptionController.getPlans);

// Stripe Webhook needs raw body
router.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  SubscriptionController.handleWebhook
);

// Protected routes
router.use(authenticate);

router.get('/my-subscription', SubscriptionController.getCurrentSubscription);
router.post(
  '/checkout',
  validate(createCheckoutSessionSchema),
  SubscriptionController.createCheckoutSession
);
router.post('/cancel', SubscriptionController.cancelSubscription);

export default router;
