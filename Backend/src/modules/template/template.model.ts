import { Schema, model, Document } from 'mongoose';

export interface ITemplate extends Document {
  title: string;
  description?: string;
  category: string;
  thumbnail_url?: string;
  theme_config?: Record<string, unknown>;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true, default: 'General' },
    thumbnail_url: String,
    theme_config: {
      type: Schema.Types.Mixed,
      default: {},
    },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexes
TemplateSchema.index({ category: 1 });
TemplateSchema.index({ is_active: 1 });

export default model<ITemplate>('Template', TemplateSchema);
