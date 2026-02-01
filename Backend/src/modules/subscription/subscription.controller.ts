import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from './subscription.service.js';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
} from '@core/utils/response.util.js';
import { getUser } from '@core/middlewares/auth.middleware.js';

export class SubscriptionController {
  static async getPlans(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await SubscriptionService.getPlans();
      sendSuccess(res, result.data, undefined, req);
    } catch (error) {
      next(error);
    }
  }

  static async createCheckoutSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { planId } = req.body as { planId: string };
      const result = await SubscriptionService.createCheckoutSession(
        user.userId,
        planId
      );
      sendCreated(res, result.data, undefined, req);
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const result = await SubscriptionService.getCurrentSubscription(
        user.userId
      );
      sendSuccess(res, result.data, undefined, req);
    } catch (error) {
      next(error);
    }
  }

  static async cancelSubscription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const result = await SubscriptionService.cancelSubscription(user.userId);
      sendSuccess(res, null, result.message, req);
    } catch (error) {
      next(error);
    }
  }

  static async handleWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const sig = req.headers['stripe-signature'] as string;
      // Stripe webhooks need the raw body
      await SubscriptionService.handleWebhook(req.body, sig);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }
}
