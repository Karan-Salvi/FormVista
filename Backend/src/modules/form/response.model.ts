import { Schema, model, Document, Types } from 'mongoose';

export interface IFormResponse extends Document {
  form_id: Types.ObjectId;
  submitted_at: Date;
  completion_time_ms?: number;
  ip_address?: string;
  user_agent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FormResponseSchema = new Schema<IFormResponse>(
  {
    form_id: { type: Schema.Types.ObjectId, ref: 'Form', required: true },

    submitted_at: { type: Date, default: Date.now },
    completion_time_ms: Number,

    ip_address: String,
    user_agent: String,
  },
  { timestamps: true }
);

export default model<IFormResponse>('FormResponse', FormResponseSchema);
