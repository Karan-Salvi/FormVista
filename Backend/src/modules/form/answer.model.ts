import { Schema, model, Document, Types } from 'mongoose';

export interface IResponseAnswer extends Document {
  response_id: Types.ObjectId;
  block_id: Types.ObjectId;
  field_key: string;
  value: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const ResponseAnswerSchema = new Schema<IResponseAnswer>(
  {
    response_id: {
      type: Schema.Types.ObjectId,
      ref: 'FormResponse',
      required: true,
    },

    block_id: {
      type: Schema.Types.ObjectId,
      ref: 'Block',
      required: true,
    },

    field_key: { type: String, required: true },

    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes
// 1. Fetch all answers for a response (most common query)
ResponseAnswerSchema.index({ response_id: 1 });

// 2. Compound index for response + block lookup
ResponseAnswerSchema.index({ response_id: 1, block_id: 1 });

// 3. Analytics: fetch all answers for a specific block/field
ResponseAnswerSchema.index({ block_id: 1 });

export default model<IResponseAnswer>('ResponseAnswer', ResponseAnswerSchema);
