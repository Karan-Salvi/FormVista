import { Schema, model, Document, Types } from 'mongoose';

export interface ISubscription extends Document {
  user_id: Types.ObjectId;
  plan_id: Types.ObjectId;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: 'active' | 'past_due' | 'canceled' | 'incomplete';
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    plan_id: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },

    stripe_subscription_id: { type: String, required: true },
    stripe_customer_id: { type: String, required: true },

    status: {
      type: String,
      enum: ['active', 'past_due', 'canceled', 'incomplete'],
      required: true,
    },

    current_period_start: Date,
    current_period_end: Date,
    cancel_at_period_end: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
// 1. Stripe subscription lookups (webhook processing)
SubscriptionSchema.index({ stripe_subscription_id: 1 }, { unique: true });

// 2. Fetch user's subscription (most common query)
SubscriptionSchema.index({ user_id: 1 });

// 3. Stripe customer lookups
SubscriptionSchema.index({ stripe_customer_id: 1 });

// 4. Filter subscriptions by status (active, canceled, etc.)
SubscriptionSchema.index({ status: 1 });

// 5. Compound index for user's active subscription
SubscriptionSchema.index({ user_id: 1, status: 1 });

// 6. Find subscriptions expiring soon (renewal reminders, cleanup jobs)
SubscriptionSchema.index({ current_period_end: 1, status: 1 });

export default model<ISubscription>('Subscription', SubscriptionSchema);
