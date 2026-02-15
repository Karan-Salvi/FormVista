import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password_hash: string;
  plan: 'free' | 'pro';
  role: 'user' | 'admin';
  stripe_customer_id?: string;
  is_email_verified: boolean;
  email_verification_token?: string;
  reset_password_token?: string;
  reset_password_expires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password_hash: { type: String, required: true },

    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    stripe_customer_id: { type: String },

    is_email_verified: { type: Boolean, default: false },
    email_verification_token: { type: String },

    reset_password_token: { type: String },
    reset_password_expires: { type: Date },
  },
  { timestamps: true }
);

// Indexes
// 1. Email is already unique at schema level, but add case-insensitive collation
UserSchema.index(
  { email: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } }
);

// 2. Stripe customer lookups (webhook processing, subscription queries)
UserSchema.index({ stripe_customer_id: 1 });

// 3. Filter users by plan (admin dashboards, analytics)
UserSchema.index({ plan: 1 });

// 4. Compound index for pagination/sorting users by plan and signup date
UserSchema.index({ plan: 1, createdAt: -1 });

// 5. Email verification status (for sending reminder emails)
UserSchema.index({ is_email_verified: 1, createdAt: -1 });

export default model<IUser>('User', UserSchema);
