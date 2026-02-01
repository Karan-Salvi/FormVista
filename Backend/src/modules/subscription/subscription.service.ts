import { logger } from '@core/utils/logger.util.js';
import PlanModel, { IPlan } from './plan.model.js';
import SubscriptionModel, { ISubscription } from './subscription.model.js';
import PaymentModel from './payment.model.js';
import StripeWebhookEventModel from './webhook-event.model.js';
import { StripeService } from '../../services/payment/stripe.service.js';
import Stripe from 'stripe';
import { env } from '@config/env.config.js';
import { NotFoundError, ValidationError } from '@core/errors/index.js';
import {
  PlansResponse,
  CheckoutSessionResponse,
  SubscriptionResponse,
  SubscriptionResponseData,
  PlanResponseData,
} from './subscription.types.js';
import { Types } from 'mongoose';
import UserModel from '../user/user.model.js';
import { ApiResponse } from '../../shared/interfaces/response.interface.js';

export class SubscriptionService {
  static async getPlans(): Promise<PlansResponse> {
    const plans = await PlanModel.find().sort({ price: 1 });
    return {
      success: true,
      data: plans.map((plan: IPlan) => this.mapPlan(plan)),
    };
  }

  static async createCheckoutSession(
    userId: string,
    planId: string
  ): Promise<CheckoutSessionResponse> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const plan = await PlanModel.findById(planId);
    if (!plan) {
      throw new NotFoundError('Plan not found');
    }

    const session = await StripeService.createCheckoutSession({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: user.email,
      client_reference_id: userId,
      success_url: env.STRIPE_SUCCESS_URL,
      cancel_url: env.STRIPE_CANCEL_URL,
      metadata: {
        userId,
        planId: planId.toString(),
      },
    });

    return {
      success: true,
      data: {
        sessionId: session.id,
        url: session.url as string,
      },
    };
  }

  static async handleWebhook(payload: string | Buffer, signature: string) {
    let event;
    try {
      event = StripeService.constructWebhookEvent(payload, signature);
    } catch (err: unknown) {
      const error = err as Error;
      logger.error('Webhook signature verification failed', error);
      throw new ValidationError(`Webhook Error: ${error.message}`);
    }

    // Log event
    await StripeWebhookEventModel.create({
      event_id: event.id,
      type: event.type,
      payload: event.data.object,
    });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await this.handleCheckoutSessionCompleted(session);
        break;
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await this.handleInvoicePaymentSucceeded(invoice);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionUpdated(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.handleSubscriptionDeleted(subscription);
        break;
      }
    }

    await StripeWebhookEventModel.updateOne(
      { event_id: event.id },
      { processed: true }
    );
  }

  private static async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ) {
    const userId = session.client_reference_id;
    const stripeSubscriptionId = session.subscription as string;
    const planId = session.metadata?.planId;

    if (!userId || !stripeSubscriptionId || !planId) {
      logger.error('Missing required data in checkout session', { session });
      return;
    }

    const stripeSubscription =
      await StripeService.retrieveSubscription(stripeSubscriptionId);

    if ((stripeSubscription as any).deleted) {
      logger.error('Subscription retrieved is deleted', {
        stripeSubscriptionId,
      });
      return;
    }

    const stripeSub = stripeSubscription as Stripe.Subscription;

    const subscription = await SubscriptionModel.create({
      user_id: new Types.ObjectId(userId),
      plan_id: new Types.ObjectId(planId),
      stripe_subscription_id: stripeSubscriptionId,
      stripe_customer_id: session.customer as string,
      status: stripeSub.status,
      current_period_start: new Date(
        (stripeSub as any).current_period_start * 1000
      ),
      current_period_end: new Date(
        (stripeSub as any).current_period_end * 1000
      ),
    });

    // Update user plan
    const plan = await PlanModel.findById(planId);
    if (plan) {
      await UserModel.findByIdAndUpdate(userId, {
        plan: plan.name.toLowerCase(),
      });
    }

    logger.info('Subscription created', {
      userId,
      subscriptionId: subscription._id,
    });
  }

  private static async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const stripeSubscriptionId = (invoice as any).subscription as string;
    if (!stripeSubscriptionId) {
      return;
    }

    const subscription = await SubscriptionModel.findOne({
      stripe_subscription_id: stripeSubscriptionId,
    });
    if (!subscription) {
      return;
    }

    await PaymentModel.create({
      user_id: subscription.user_id,
      subscription_id: subscription._id,
      stripe_invoice_id: invoice.id,
      stripe_payment_intent_id: (invoice as any).payment_intent as string,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
    });
  }

  private static async handleSubscriptionUpdated(
    stripeSubscription: Stripe.Subscription
  ) {
    await SubscriptionModel.updateOne(
      { stripe_subscription_id: stripeSubscription.id },
      {
        status: stripeSubscription.status,
        current_period_start: new Date(
          (stripeSubscription as any).current_period_start * 1000
        ),
        current_period_end: new Date(
          (stripeSubscription as any).current_period_end * 1000
        ),
        cancel_at_period_end: stripeSubscription.cancel_at_period_end,
      }
    );
  }

  private static async handleSubscriptionDeleted(
    stripeSubscription: Stripe.Subscription
  ) {
    const subscription = await SubscriptionModel.findOneAndUpdate(
      { stripe_subscription_id: stripeSubscription.id },
      { status: 'canceled' },
      { new: true }
    );

    if (subscription) {
      await UserModel.findByIdAndUpdate(subscription.user_id, { plan: 'free' });
    }
  }

  static async getCurrentSubscription(
    userId: string
  ): Promise<SubscriptionResponse> {
    const subscription = await SubscriptionModel.findOne({
      user_id: new Types.ObjectId(userId),
      status: 'active',
    }).populate('plan_id');

    if (!subscription) {
      return {
        success: true,
        data: undefined as unknown as SubscriptionResponseData,
      };
    }

    return {
      success: true,
      data: this.mapSubscription(subscription),
    };
  }

  static async cancelSubscription(userId: string): Promise<ApiResponse<void>> {
    const subscription = await SubscriptionModel.findOne({
      user_id: new Types.ObjectId(userId),
      status: 'active',
    });

    if (!subscription) {
      throw new NotFoundError('No active subscription found');
    }

    await StripeService.cancelSubscription(subscription.stripe_subscription_id);

    return {
      success: true,
      message: 'Subscription canceled successfully',
    };
  }

  private static mapPlan(plan: IPlan): PlanResponseData {
    return {
      id: (plan as any)._id?.toString() || (plan as any).id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      billing_interval: plan.billing_interval,
      features: plan.features,
    };
  }

  private static mapSubscription(sub: ISubscription): SubscriptionResponseData {
    return {
      id: (sub as any)._id?.toString() || (sub as any).id,
      status: sub.status,
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end,
      cancel_at_period_end: sub.cancel_at_period_end,
      plan: sub.plan_id ? this.mapPlan(sub.plan_id as any) : undefined,
    };
  }
}
