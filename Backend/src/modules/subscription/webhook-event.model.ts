import { Schema, model, Document } from 'mongoose';

export interface IStripeWebhookEvent extends Document {
  event_id: string;
  type: string;
  payload: any;
  processed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StripeWebhookEventSchema = new Schema<IStripeWebhookEvent>({
  event_id: { type: String, required: true, unique: true },
  type: { type: String, required: true },

  payload: { type: Schema.Types.Mixed, required: true },

  processed: { type: Boolean, default: false },
});

// Indexes
// 1. event_id is already unique at schema level (idempotency)
// No additional index needed

// 2. Find unprocessed events (background job processing)
StripeWebhookEventSchema.index({ processed: 1, createdAt: 1 });

// 3. Filter events by type (debugging, analytics)
StripeWebhookEventSchema.index({ type: 1 });

// 4. Compound index for unprocessed events of specific type
StripeWebhookEventSchema.index({ type: 1, processed: 1, createdAt: 1 });

// 5. TTL index: auto-delete webhook events older than 90 days
StripeWebhookEventSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 7776000 }
); // 90 days

export default model<IStripeWebhookEvent>(
  'StripeWebhookEvent',
  StripeWebhookEventSchema
);
