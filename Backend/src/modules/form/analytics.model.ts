import { Schema, model, Document, Types } from 'mongoose';

export interface IFormAnalytics extends Document {
  form_id: Types.ObjectId;
  total_views: number;
  total_submissions: number;
  avg_completion_time_ms?: number;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema = new Schema<IFormAnalytics>({
  form_id: { type: Schema.Types.ObjectId, ref: 'Form', unique: true },

  total_views: { type: Number, default: 0 },
  total_submissions: { type: Number, default: 0 },

  avg_completion_time_ms: Number,
});

// Indexes
// 1. form_id is already unique at schema level (1:1 relationship)
// This is optimal for analytics lookups - no additional indexes needed

export default model<IFormAnalytics>('FormAnalytics', AnalyticsSchema);
