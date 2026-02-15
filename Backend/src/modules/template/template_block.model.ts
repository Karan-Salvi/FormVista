import { Schema, model, Document, Types } from 'mongoose';

export interface ITemplateBlock extends Document {
  template_id: Types.ObjectId;
  type: string;
  label: string;
  field_key: string;
  position: number;
  required: boolean;
  config?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateBlockSchema = new Schema<ITemplateBlock>(
  {
    template_id: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      required: true,
    },
    type: { type: String, required: true },
    label: { type: String, default: '' },
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

TemplateBlockSchema.index({ template_id: 1, position: 1 });

export default model<ITemplateBlock>('TemplateBlock', TemplateBlockSchema);
