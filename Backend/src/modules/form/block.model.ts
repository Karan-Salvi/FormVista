import { Schema, model, Document, Types } from 'mongoose';

export interface IBlock extends Document {
  form_id: Types.ObjectId;
  type: string;
  label: string;
  field_key: string;
  position: number;
  required: boolean;
  config?: any;
  createdAt: Date;
  updatedAt: Date;
}

const BlockSchema = new Schema<IBlock>(
  {
    form_id: { type: Schema.Types.ObjectId, ref: 'Form', required: true },

    type: { type: String, required: true },

    label: { type: String, required: true },
    field_key: { type: String, required: true },

    position: { type: Number, required: true },
    required: { type: Boolean, default: false },

    config: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Indexes
BlockSchema.index({ form_id: 1, field_key: 1 }, { unique: true });
BlockSchema.index({ form_id: 1 });

export default model<IBlock>('Block', BlockSchema);
