import { Schema, model, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  user_id: Types.ObjectId;
  subscription_id?: Types.ObjectId;
  stripe_payment_intent_id?: string;
  stripe_invoice_id?: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  payment_method?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subscription_id: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
    },

    stripe_payment_intent_id: String,
    stripe_invoice_id: String,

    amount: { type: Number, required: true }, // smallest unit
    currency: { type: String, default: 'INR' },

    status: {
      type: String,
      enum: ['succeeded', 'failed', 'pending'],
      required: true,
    },

    payment_method: String,
  },
  { timestamps: true }
);

// Indexes
PaymentSchema.index({ stripe_payment_intent_id: 1 });

export default model<IPayment>('Payment', PaymentSchema);
