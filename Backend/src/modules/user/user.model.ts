import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password_hash: string;
  plan: 'free' | 'pro';
  stripe_customer_id?: string;
  is_email_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },

    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },

    stripe_customer_id: { type: String },

    is_email_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ stripe_customer_id: 1 });

export default model<IUser>('User', UserSchema);
