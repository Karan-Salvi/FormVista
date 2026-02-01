import { logger } from '@core/utils/logger.util.js';
import FormModel, { IForm } from './form.model.js';
import BlockModel from './block.model.js';
import FormResponseModel from './response.model.js';
import ResponseAnswerModel from './answer.model.js';
import FormAnalyticsModel from './analytics.model.js';
import {
  CreateFormRequest,
  UpdateFormRequest,
  AddBlockRequest,
  SubmitResponseRequest,
  FormResponse,
  FormsResponse,
  BlockResponse,
  BlocksResponse,
  FormResponseData,
  FormResponsesResponse,
} from './form.types.js';
import { NotFoundError, ValidationError } from '@core/errors/index.js';
import { Types } from 'mongoose';
import { ApiResponse } from '../../shared/interfaces/response.interface.js';

export class FormService {
  static async createForm(
    userId: string,
    data: CreateFormRequest
  ): Promise<FormResponse> {
    try {
      let finalSlug = data.slug;
      const existingForm = await FormModel.findOne({ slug: finalSlug });

      if (existingForm) {
        // Append a short random string if slug is taken
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        finalSlug = `${data.slug}-${randomSuffix}`;
      }

      const form = await FormModel.create({
        ...data,
        slug: finalSlug,
        user_id: new Types.ObjectId(userId),
      });

      // Initialize analytics
      await FormAnalyticsModel.create({ form_id: form._id });

      return {
        success: true,
        message: 'Form created successfully',
        data: this.mapForm(form),
      };
    } catch (error) {
      logger.error('Error creating form', error);
      throw error;
    }
  }

  static async getForms(userId: string): Promise<FormsResponse> {
    const forms = await FormModel.find({
      user_id: new Types.ObjectId(userId),
    }).sort({ createdAt: -1 });
    return {
      success: true,
      data: forms.map((form) => this.mapForm(form)),
    };
  }

  static async getFormBySlug(slug: string): Promise<FormResponse> {
    const form = await FormModel.findOne({ slug });
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    // Increment views
    await FormAnalyticsModel.updateOne(
      { form_id: form._id },
      { $inc: { total_views: 1 } }
    );

    const blocks = await BlockModel.find({ form_id: form._id }).sort({
      position: 1,
    });
    return {
      success: true,
      data: this.mapForm(form, blocks),
    };
  }

  static async getFormById(
    formId: string,
    userId: string
  ): Promise<FormResponse> {
    const form = await FormModel.findOne({ _id: formId, user_id: userId });
    if (!form) {
      throw new NotFoundError('Form not found');
    }
    const blocks = await BlockModel.find({ form_id: form._id }).sort({
      position: 1,
    });
    return {
      success: true,
      data: this.mapForm(form, blocks),
    };
  }

  static async updateForm(
    formId: string,
    userId: string,
    data: UpdateFormRequest
  ): Promise<FormResponse> {
    const { blocks, ...formData } = data;

    const form = await FormModel.findOneAndUpdate(
      { _id: formId, user_id: userId },
      { $set: formData },
      { new: true }
    );

    if (!form) {
      throw new NotFoundError('Form not found');
    }

    if (blocks) {
      // Get existing blocks
      const existingBlocks = await BlockModel.find({ form_id: form._id });
      const existingBlockIds = existingBlocks.map((b) => b._id.toString());
      const incomingBlockIds = blocks
        .filter((b) => b.id)
        .map((b) => b.id as string);

      // Delete blocks not in incoming
      const blocksToDelete = existingBlockIds.filter(
        (id) => !incomingBlockIds.includes(id)
      );
      if (blocksToDelete.length > 0) {
        await BlockModel.deleteMany({ _id: { $in: blocksToDelete } });
      }

      // Update or Create
      for (const block of blocks) {
        if (block.id && existingBlockIds.includes(block.id)) {
          // Update
          await BlockModel.findByIdAndUpdate(block.id, {
            $set: {
              type: block.type,
              label: block.label,
              field_key: block.field_key,
              position: block.position,
              required: block.required,
              config: block.config,
            },
          });
        } else {
          // Create
          await BlockModel.create({
            form_id: form._id,
            type: block.type,
            label: block.label,
            field_key:
              block.field_key ||
              `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            position: block.position,
            required: block.required,
            config: block.config,
          });
        }
      }
    }

    return {
      success: true,
      message: 'Form updated successfully',
      data: this.mapForm(form),
    };
  }

  static async deleteForm(
    formId: string,
    userId: string
  ): Promise<ApiResponse<void>> {
    const form = await FormModel.findOneAndDelete({
      _id: formId,
      user_id: userId,
    });
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    // Clean up related data
    await BlockModel.deleteMany({ form_id: formId });
    await FormResponseModel.deleteMany({ form_id: formId });
    await FormAnalyticsModel.deleteOne({ form_id: formId });

    return {
      success: true,
      message: 'Form deleted successfully',
    };
  }

  // Block management
  static async addBlock(
    formId: string,
    userId: string,
    data: AddBlockRequest
  ): Promise<BlockResponse> {
    const form = await FormModel.findOne({ _id: formId, user_id: userId });
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    const block = await BlockModel.create({
      ...data,
      form_id: new Types.ObjectId(formId),
    });

    return {
      success: true,
      message: 'Block added successfully',
      data: block,
    };
  }

  static async getBlocks(formId: string): Promise<BlocksResponse> {
    const blocks = await BlockModel.find({ form_id: formId }).sort({
      position: 1,
    });
    return {
      success: true,
      data: blocks,
    };
  }

  static async updateBlock(
    blockId: string,
    data: Partial<AddBlockRequest>
  ): Promise<BlockResponse> {
    const block = await BlockModel.findByIdAndUpdate(
      blockId,
      { $set: data },
      { new: true }
    );
    if (!block) {
      throw new NotFoundError('Block not found');
    }
    return {
      success: true,
      data: block,
    };
  }

  static async deleteBlock(blockId: string): Promise<ApiResponse<void>> {
    const block = await BlockModel.findByIdAndDelete(blockId);
    if (!block) {
      throw new NotFoundError('Block not found');
    }
    return {
      success: true,
      message: 'Block deleted successfully',
    };
  }

  // Response management
  static async submitResponse(
    formSlug: string,
    data: SubmitResponseRequest
  ): Promise<ApiResponse<void>> {
    const form = await FormModel.findOne({
      slug: formSlug,
      status: 'published',
    });
    if (!form) {
      throw new ValidationError('Form is not available for submissions');
    }

    const response = await FormResponseModel.create({
      form_id: form._id,
      completion_time_ms: data.completion_time_ms,
    });

    const answers = data.answers.map((ans) => ({
      response_id: response._id,
      block_id: new Types.ObjectId(ans.block_id),
      field_key: ans.field_key,
      value: ans.value,
    }));

    await ResponseAnswerModel.insertMany(answers);

    // Update analytics
    await FormAnalyticsModel.updateOne(
      { form_id: form._id },
      {
        $inc: { total_submissions: 1 },
      }
    );

    return {
      success: true,
      message: 'Response submitted successfully',
    };
  }

  static async getResponses(
    formId: string,
    userId: string
  ): Promise<FormResponsesResponse> {
    const form = await FormModel.findOne({ _id: formId, user_id: userId });
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    const responses = await FormResponseModel.find({ form_id: formId }).sort({
      createdAt: -1,
    });

    const responseData: FormSubmissionData[] = await Promise.all(
      responses.map(async (res) => {
        const answers = await ResponseAnswerModel.find({
          response_id: res._id,
        });
        return {
          id: res._id.toString(),
          submittedAt: res.createdAt,
          answers: answers.map((ans) => ({
            block_id: ans.block_id.toString(),
            field_key: ans.field_key,
            value: ans.value,
          })),
        };
      })
    );

    return {
      success: true,
      data: responseData,
    };
  }

  private static mapForm(form: IForm, blocks?: IBlock[]): FormResponseData {
    return {
      id: form._id.toString(),
      title: form.title,
      description: form.description,
      slug: form.slug,
      status: form.status,
      theme_config: form.theme_config,
      export_settings: form.export_settings,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      blocks: blocks,
    };
  }
}
