import { Schema, model, Document } from 'mongoose';

export interface IStripeWebhookEvent extends Document {
  event_id: string;
  type: string;
  payload: any;
  processed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StripeWebhookEventSchema = new Schema<IStripeWebhookEvent>(
  {
    event_id: { type: String, required: true, unique: true },
    type: { type: String, required: true },

    payload: { type: Schema.Types.Mixed, required: true },

    processed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IStripeWebhookEvent>(
  'StripeWebhookEvent',
  StripeWebhookEventSchema
);
