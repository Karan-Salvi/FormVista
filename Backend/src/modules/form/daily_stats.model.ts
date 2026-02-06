import { Schema, model, Document, Types } from 'mongoose';

export interface IDailyStats extends Document {
  form_id: Types.ObjectId;
  user_id: Types.ObjectId;
  date: Date;
  views: number;
  submissions: number;
}

const DailyStatsSchema = new Schema<IDailyStats>({
  form_id: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  views: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
});

// Compound index for efficient lookups and uniqueness per day per form
DailyStatsSchema.index({ form_id: 1, date: 1 }, { unique: true });
DailyStatsSchema.index({ user_id: 1, date: 1 });

export default model<IDailyStats>('DailyStats', DailyStatsSchema);
