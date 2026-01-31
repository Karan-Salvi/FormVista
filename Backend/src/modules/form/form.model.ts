import { Schema, model, Document, Types } from 'mongoose';

export interface IForm extends Document {
  user_id: Types.ObjectId;
  title: string;
  description?: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  theme_config?: any;
  export_settings: {
    fileName?: string;
    includeMetadata: boolean;
    dateFormat: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FormSchema = new Schema<IForm>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    title: { type: String, required: true },
    description: String,

    slug: { type: String, required: true, unique: true },

    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },

    theme_config: {
      type: Schema.Types.Mixed,
      default: {},
    },

    export_settings: {
      fileName: String,
      includeMetadata: { type: Boolean, default: true },
      dateFormat: { type: String, default: 'DD-MM-YYYY' },
    },
  },
  { timestamps: true }
);

export default model<IForm>('Form', FormSchema);
