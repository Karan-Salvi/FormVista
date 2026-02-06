import { Schema, model, Document, Types } from 'mongoose';

export interface IFormResponse extends Document {
  form_id: Types.ObjectId;
  submitted_at: Date;
  completion_time_ms?: number;
  ip_address?: string;
  user_agent?: string;
  notes?: string;
  tags?: string[];
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
    notes: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Indexes
// 1. Fetch all responses for a form (most common query)
FormResponseSchema.index({ form_id: 1, submitted_at: -1 });

// 2. Time-based analytics and filtering
FormResponseSchema.index({ submitted_at: -1 });

// 3. Compound index for form responses with pagination by creation time
FormResponseSchema.index({ form_id: 1, createdAt: -1 });

export default model<IFormResponse>('FormResponse', FormResponseSchema);
