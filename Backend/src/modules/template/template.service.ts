import { logger } from '@core/utils/logger.util.js';
import TemplateModel from './template.model.js';
import TemplateBlockModel from './template_block.model.js';
import FormModel from '../form/form.model.js';
import BlockModel from '../form/block.model.js';
import FormAnalyticsModel from '../form/analytics.model.js';
import {
  CreateTemplateRequest,
  TemplateResponse,
  TemplatesResponse,
  TemplateResponseData,
} from './template.types.js';
import { NotFoundError } from '@core/errors/index.js';
import { Types } from 'mongoose';

export class TemplateService {
  static async createTemplate(
    data: CreateTemplateRequest
  ): Promise<TemplateResponse> {
    try {
      const { blocks, ...templateData } = data;

      const template = await TemplateModel.create(templateData);

      if (blocks && blocks.length > 0) {
        const blocksWithId = blocks.map((block) => ({
          ...block,
          template_id: template._id,
        }));
        await TemplateBlockModel.insertMany(blocksWithId);
      }

      return {
        success: true,
        message: 'Template created successfully',
        data: await this.getTemplateByIdInternal(template._id.toString()),
      };
    } catch (error) {
      logger.error('Error creating template', error);
      throw error;
    }
  }

  static async getTemplates(): Promise<TemplatesResponse> {
    try {
      const templates = await TemplateModel.find({ is_active: true }).sort({
        category: 1,
        title: 1,
      });

      const data = await Promise.all(
        templates.map(async (t) => {
          return {
            id: t._id.toString(),
            title: t.title,
            description: t.description,
            category: t.category,
            thumbnail_url: t.thumbnail_url,
            theme_config: t.theme_config,
          };
        })
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      logger.error('Error fetching templates', error);
      throw error;
    }
  }

  static async getTemplateById(templateId: string): Promise<TemplateResponse> {
    const data = await this.getTemplateByIdInternal(templateId);
    return {
      success: true,
      data,
    };
  }

  private static async getTemplateByIdInternal(
    templateId: string
  ): Promise<TemplateResponseData> {
    const template = await TemplateModel.findById(templateId);
    if (!template) {
      throw new NotFoundError('Template not found');
    }

    const blocks = await TemplateBlockModel.find({
      template_id: template._id,
    }).sort({ position: 1 });

    return {
      id: template._id.toString(),
      title: template.title,
      description: template.description,
      category: template.category,
      thumbnail_url: template.thumbnail_url,
      theme_config: template.theme_config,
      blocks: blocks.map((b) => ({
        type: b.type,
        label: b.label,
        field_key: b.field_key,
        position: b.position,
        required: b.required,
        config: b.config,
      })),
    };
  }

  static async createFormFromTemplate(
    userId: string,
    templateId: string,
    title?: string
  ): Promise<{
    success: boolean;
    message: string;
    data: { id: string; slug: string };
  }> {
    try {
      const template = await TemplateModel.findById(templateId);
      if (!template) {
        throw new NotFoundError('Template not found');
      }

      const templateBlocks = await TemplateBlockModel.find({
        template_id: template._id,
      }).sort({ position: 1 });

      const slug =
        (title || template.title).toLowerCase().replace(/[^a-z0-9]+/g, '-') +
        '-' +
        Math.random().toString(36).substring(2, 7);

      const form = await FormModel.create({
        user_id: new Types.ObjectId(userId),
        title: title || template.title,
        description: template.description,
        slug,
        status: 'draft',
        theme_config: template.theme_config,
      });

      // Initialize analytics
      await FormAnalyticsModel.create({ form_id: form._id });

      if (templateBlocks.length > 0) {
        const formBlocks = templateBlocks.map((b) => ({
          form_id: form._id,
          type: b.type,
          label: b.label,
          field_key: b.field_key,
          position: b.position,
          required: b.required,
          config: b.config,
        }));
        await BlockModel.insertMany(formBlocks);
      }

      return {
        success: true,
        message: 'Form created from template',
        data: {
          id: form._id.toString(),
          slug: form.slug,
        },
      };
    } catch (error) {
      logger.error('Error creating form from template', error);
      throw error;
    }
  }

  static async deleteTemplate(
    templateId: string
  ): Promise<{ success: boolean; message: string }> {
    const template = await TemplateModel.findByIdAndDelete(templateId);
    if (!template) {
      throw new NotFoundError('Template not found');
    }
    await TemplateBlockModel.deleteMany({ template_id: templateId });
    return {
      success: true,
      message: 'Template deleted successfully',
    };
  }
}
