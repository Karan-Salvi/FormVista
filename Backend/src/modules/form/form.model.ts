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

const FormSchema = new Schema<IForm>({
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
});

// Indexes
// 1. Slug is already unique at schema level for public form access
// No additional index needed - already defined in schema

// 2. User's forms - most common query (dashboard, form list)
FormSchema.index({ user_id: 1, createdAt: -1 });

// 3. Filter forms by status (published, draft, archived)
FormSchema.index({ status: 1 });

// 4. Compound index for user's forms filtered by status with pagination
FormSchema.index({ user_id: 1, status: 1, createdAt: -1 });

// 5. Find all published forms (public gallery, search)
FormSchema.index({ status: 1, createdAt: -1 });

export default model<IForm>('Form', FormSchema);
