import { Schema, model, Document } from 'mongoose';

export interface IPlan extends Document {
  name: string;
  price: number;
  currency: string;
  billing_interval: 'month' | 'year';
  stripe_product_id: string;
  stripe_price_id: string;
  features: {
    unlimited_forms: boolean;
    unlimited_responses: boolean;
    excel_export: boolean;
    remove_branding: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PlanSchema = new Schema<IPlan>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },

  billing_interval: {
    type: String,
    enum: ['month', 'year'],
    required: true,
  },

  stripe_product_id: { type: String, required: true },
  stripe_price_id: { type: String, required: true },

  features: {
    unlimited_forms: { type: Boolean, default: false },
    unlimited_responses: { type: Boolean, default: false },
    excel_export: { type: Boolean, default: false },
    remove_branding: { type: Boolean, default: false },
  },
});

// Indexes
// 1. Stripe product lookups (webhook processing, plan sync)
PlanSchema.index({ stripe_product_id: 1 }, { unique: true });

// 2. Stripe price lookups (checkout, subscription creation)
PlanSchema.index({ stripe_price_id: 1 }, { unique: true });

// 3. Filter plans by billing interval (monthly vs yearly)
PlanSchema.index({ billing_interval: 1 });

// 4. Compound index for pricing page (sort by price)
PlanSchema.index({ billing_interval: 1, price: 1 });

export default model<IPlan>('Plan', PlanSchema);
