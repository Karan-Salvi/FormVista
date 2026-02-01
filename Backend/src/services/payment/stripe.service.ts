import Stripe from 'stripe';
import { env } from '@config/env.config.js';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia' as any,
});

export class StripeService {
  static async createCheckoutSession(
    params: Stripe.Checkout.SessionCreateParams
  ) {
    return await stripe.checkout.sessions.create(params);
  }

  static async retrieveSubscription(subscriptionId: string) {
    return await stripe.subscriptions.retrieve(subscriptionId);
  }

  static async cancelSubscription(subscriptionId: string) {
    return await stripe.subscriptions.cancel(subscriptionId);
  }

  static constructWebhookEvent(payload: string | Buffer, sig: string) {
    if (!env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
    }
    return stripe.webhooks.constructEvent(
      payload,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  }
}
