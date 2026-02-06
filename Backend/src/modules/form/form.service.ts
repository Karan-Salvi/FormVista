import { logger } from '@core/utils/logger.util.js';
import FormModel, { IForm } from './form.model.js';
import BlockModel, { IBlock } from './block.model.js';
import FormResponseModel from './response.model.js';
import ResponseAnswerModel from './answer.model.js';
import FormAnalyticsModel from './analytics.model.js';
import DailyStatsModel from './daily_stats.model.js';
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
  FormSubmissionData,
} from './form.types.js';
import { NotFoundError, ValidationError } from '@core/errors/index.js';
import { Types } from 'mongoose';
import { ApiResponse } from '../../shared/interfaces/response.interface.js';
import redisClient from '@config/redis.config.js';

// Cache key generators
const CACHE_KEYS = {
  formBySlug: (slug: string) => `form:slug:${slug}`,
  formById: (formId: string) => `form:id:${formId}`,
  userForms: (userId: string) => `forms:user:${userId}`,
  formBlocks: (formId: string) => `blocks:form:${formId}`,
  formResponses: (formId: string, page: number, limit: number) =>
    `responses:form:${formId}:page:${page}:limit:${limit}`,
};

// Cache TTL in seconds
const CACHE_TTL = {
  form: 3600, // 1 hour for form data
  blocks: 3600, // 1 hour for blocks
  userForms: 300, // 5 minutes for user's forms list
  responses: 60, // 1 minute for responses (frequently updated)
};

export class FormService {
  // Cache invalidation helpers
  private static async invalidateFormCache(formId: string, slug?: string) {
    const keys = [CACHE_KEYS.formById(formId)];
    if (slug) {
      keys.push(CACHE_KEYS.formBySlug(slug));
    }
    keys.push(CACHE_KEYS.formBlocks(formId));
    await Promise.all(keys.map((key) => redisClient.del(key)));
  }

  private static async invalidateUserFormsCache(userId: string) {
    await redisClient.del(CACHE_KEYS.userForms(userId));
  }

  private static async invalidateResponsesCache(formId: string) {
    // Delete all response cache keys for this form (pattern matching)
    const pattern = `responses:form:${formId}:*`;
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(...keys);
    }
  }
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

      // Invalidate user's forms cache
      await this.invalidateUserFormsCache(userId);

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
    const cacheKey = CACHE_KEYS.userForms(userId);

    try {
      // Try to get from cache
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        logger.info(`Cache hit for user forms: ${userId}`);
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.warn('Redis get error, falling back to database', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Cache miss - fetch from database with analytics
    const formsWithAnalytics = await FormModel.aggregate([
      {
        $match: {
          user_id: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'formanalytics',
          localField: '_id',
          foreignField: 'form_id',
          as: 'analytics',
        },
      },
      {
        $unwind: {
          path: '$analytics',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const response = {
      success: true,
      data: formsWithAnalytics.map((form) => ({
        ...this.mapForm(form),
        analytics: {
          total_views: form.analytics?.total_views || 0,
          total_submissions: form.analytics?.total_submissions || 0,
        },
      })),
    };

    // Store in cache
    try {
      await redisClient.setex(
        cacheKey,
        CACHE_TTL.userForms,
        JSON.stringify(response)
      );
    } catch (error) {
      logger.warn('Redis set error', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return response;
  }

  static async getFormBySlug(slug: string): Promise<FormResponse> {
    const cacheKey = CACHE_KEYS.formBySlug(slug);

    try {
      // Try to get from cache
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        logger.info(`Cache hit for form slug: ${slug}`);
        // Still increment views even for cached responses
        const cachedData = JSON.parse(cached);
        const formId = new Types.ObjectId(cachedData.data.id);
        const userId = new Types.ObjectId(cachedData.data.user_id);

        await Promise.all([
          FormAnalyticsModel.updateOne(
            { form_id: formId },
            { $inc: { total_views: 1 } }
          ),
          DailyStatsModel.updateOne(
            {
              form_id: formId,
              date: new Date().setHours(0, 0, 0, 0),
            },
            {
              $inc: { views: 1 },
              $setOnInsert: { user_id: userId },
            },
            { upsert: true }
          ),
        ]);
        return cachedData;
      }
    } catch (error) {
      logger.warn('Redis get error, falling back to database', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Cache miss - fetch from database
    const form = await FormModel.findOne({ slug });

    if (!form) {
      throw new NotFoundError('Form not found');
    }

    // Increment views
    const today = new Date().setHours(0, 0, 0, 0);
    await Promise.all([
      FormAnalyticsModel.updateOne(
        { form_id: form._id },
        { $inc: { total_views: 1 } }
      ),
      DailyStatsModel.updateOne(
        { form_id: form._id, date: today },
        {
          $inc: { views: 1 },
          $setOnInsert: { user_id: form.user_id },
        },
        { upsert: true }
      ),
    ]);

    const blocks = await BlockModel.find({ form_id: form._id }).sort({
      position: 1,
    });

    const response = {
      success: true,
      data: this.mapForm(form, blocks),
    };

    // Store in cache
    try {
      await redisClient.setex(
        cacheKey,
        CACHE_TTL.form,
        JSON.stringify(response)
      );
    } catch (error) {
      logger.warn('Redis set error', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return response;
  }

  static async getFormById(
    formId: string,
    userId: string
  ): Promise<FormResponse> {
    const cacheKey = CACHE_KEYS.formById(formId);

    try {
      // Try to get from cache
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        logger.info(`Cache hit for form ID: ${formId}`);
        const cachedData = JSON.parse(cached);
        // Verify ownership (security check even for cached data)
        // If user_id is missing (legacy cache), treat as miss to refresh
        if (cachedData.data.user_id) {
          if (cachedData.data.user_id !== userId) {
            throw new NotFoundError('Form not found');
          }
          return cachedData;
        }
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.warn('Redis get error, falling back to database', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Cache miss - fetch from database
    const form = await FormModel.findOne({ _id: formId, user_id: userId });
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    const blocks = await BlockModel.find({ form_id: form._id }).sort({
      position: 1,
    });

    const response = {
      success: true,
      data: this.mapForm(form, blocks),
    };

    // Store in cache
    try {
      await redisClient.setex(
        cacheKey,
        CACHE_TTL.form,
        JSON.stringify(response)
      );
    } catch (error) {
      logger.warn('Redis set error', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return response;
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

    // Invalidate all related caches
    await Promise.all([
      this.invalidateFormCache(formId, form.slug),
      this.invalidateUserFormsCache(userId),
    ]);

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

    // Invalidate all related caches
    await Promise.all([
      this.invalidateFormCache(formId, form.slug),
      this.invalidateUserFormsCache(userId),
      this.invalidateResponsesCache(formId),
    ]);

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

    // Invalidate form caches since blocks changed
    await this.invalidateFormCache(formId, form.slug);

    return {
      success: true,
      message: 'Block added successfully',
      data: block,
    };
  }

  static async getBlocks(formId: string): Promise<BlocksResponse> {
    const cacheKey = CACHE_KEYS.formBlocks(formId);

    try {
      // Try to get from cache
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        logger.info(`Cache hit for form blocks: ${formId}`);
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.warn('Redis get error, falling back to database', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Cache miss - fetch from database
    const blocks = await BlockModel.find({ form_id: formId }).sort({
      position: 1,
    });

    const response = {
      success: true,
      data: blocks,
    };

    // Store in cache
    try {
      await redisClient.setex(
        cacheKey,
        CACHE_TTL.blocks,
        JSON.stringify(response)
      );
    } catch (error) {
      logger.warn('Redis set error', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return response;
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

    // Invalidate form caches
    const form = await FormModel.findById(block.form_id);
    if (form) {
      await this.invalidateFormCache(form._id.toString(), form.slug);
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

    // Invalidate form caches
    const form = await FormModel.findById(block.form_id);
    if (form) {
      await this.invalidateFormCache(form._id.toString(), form.slug);
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
    const today = new Date().setHours(0, 0, 0, 0);
    await Promise.all([
      FormAnalyticsModel.updateOne(
        { form_id: form._id },
        { $inc: { total_submissions: 1 } }
      ),
      DailyStatsModel.updateOne(
        { form_id: form._id, date: today },
        {
          $inc: { submissions: 1 },
          $setOnInsert: { user_id: form.user_id },
        },
        { upsert: true }
      ),
    ]);

    // Invalidate responses cache for this form
    await this.invalidateResponsesCache(form._id.toString());

    return {
      success: true,
      message: 'Response submitted successfully',
    };
  }

  static async getResponses(
    formId: string,
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<FormResponsesResponse> {
    const form = await FormModel.findOne({ _id: formId, user_id: userId });
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    const cacheKey = CACHE_KEYS.formResponses(formId, page, limit);

    try {
      // Try to get from cache
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        logger.info(`Cache hit for form responses: ${formId}`);
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.warn('Redis get error, falling back to database', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Cache miss - fetch from database
    const total = await FormResponseModel.countDocuments({ form_id: formId });
    const totalPages = Math.ceil(total / limit);

    const responses = await FormResponseModel.find({ form_id: formId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

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
          notes: (res as any).notes || '',
          tags: (res as any).tags || [],
        };
      })
    );

    const response = {
      success: true,
      data: {
        items: responseData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };

    // Store in cache with short TTL
    try {
      await redisClient.setex(
        cacheKey,
        CACHE_TTL.responses,
        JSON.stringify(response)
      );
    } catch (error) {
      logger.warn('Redis set error', {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return response;
  }

  static async updateResponse(
    responseId: string,
    userId: string,
    data: { notes?: string; tags?: string[] }
  ): Promise<ApiResponse<void>> {
    const res = await FormResponseModel.findById(responseId);
    if (!res) {
      throw new Error('Response not found');
    }

    const form = await FormModel.findOne({ _id: res.form_id, user_id: userId });
    if (!form) {
      throw new Error('Unauthorized to update this response');
    }

    if (data.notes !== undefined) {
      (res as any).notes = data.notes;
    }
    if (data.tags !== undefined) {
      (res as any).tags = data.tags;
    }

    await res.save();

    // Invalidate responses cache
    await this.invalidateResponsesCache(res.form_id.toString());

    return { success: true };
  }

  static async getDashboardStats(userId: string): Promise<ApiResponse<any>> {
    const today = new Date().setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(today - 14 * 24 * 60 * 60 * 1000);

    const userForms = await FormModel.find({
      user_id: new Types.ObjectId(userId),
    });
    const userFormIds = userForms.map((f) => f._id);

    // Get stats for last 7 days
    const currentPeriodStats = await DailyStatsModel.find({
      form_id: { $in: userFormIds },
      date: { $gte: sevenDaysAgo },
    });

    // Get stats for previous 7 days (for trends)
    const previousPeriodStats = await DailyStatsModel.find({
      form_id: { $in: userFormIds },
      date: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
    });

    const currentSubmissions = currentPeriodStats.reduce(
      (acc, curr) => acc + curr.submissions,
      0
    );
    const previousSubmissions = previousPeriodStats.reduce(
      (acc, curr) => acc + curr.submissions,
      0
    );

    const currentViews = currentPeriodStats.reduce(
      (acc, curr) => acc + curr.views,
      0
    );
    const previousViews = previousPeriodStats.reduce(
      (acc, curr) => acc + curr.views,
      0
    );

    // Get total across all time
    const totalStats = await FormAnalyticsModel.aggregate([
      {
        $match: {
          form_id: { $in: userFormIds },
        },
      },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: '$total_submissions' },
          totalViews: { $sum: '$total_views' },
        },
      },
    ]);

    const totals = totalStats[0] || { totalSubmissions: 0, totalViews: 0 };

    return {
      success: true,
      data: {
        submissions: {
          total: totals.totalSubmissions,
          thisWeek: currentSubmissions,
          trend: currentSubmissions - previousSubmissions,
        },
        views: {
          total: totals.totalViews,
          thisWeek: currentViews,
          trend: currentViews - previousViews,
        },
        conversion: {
          rate:
            totals.totalViews > 0
              ? (totals.totalSubmissions / totals.totalViews) * 100
              : 0,
          previousRate:
            previousViews > 0 ? (previousSubmissions / previousViews) * 100 : 0,
        },
      },
    };
  }

  static async getFormStats(
    formId: string,
    userId: string
  ): Promise<ApiResponse<any>> {
    const form = await FormModel.findOne({ _id: formId, user_id: userId });
    if (!form) {
      throw new NotFoundError('Form not found');
    }

    const analytics = await FormAnalyticsModel.findOne({ form_id: formId });
    const today = new Date().setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(today - 14 * 24 * 60 * 60 * 1000);

    const currentPeriodStats = await DailyStatsModel.find({
      form_id: formId,
      date: { $gte: sevenDaysAgo },
    });

    const previousPeriodStats = await DailyStatsModel.find({
      form_id: formId,
      date: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo },
    });

    const currentSubmissions = currentPeriodStats.reduce(
      (acc, curr) => acc + curr.submissions,
      0
    );
    const previousSubmissions = previousPeriodStats.reduce(
      (acc, curr) => acc + curr.submissions,
      0
    );

    const currentViews = currentPeriodStats.reduce(
      (acc, curr) => acc + curr.views,
      0
    );
    const previousViews = previousPeriodStats.reduce(
      (acc, curr) => acc + curr.views,
      0
    );

    return {
      success: true,
      data: {
        submissions: {
          total: analytics?.total_submissions || 0,
          thisWeek: currentSubmissions,
          trend: currentSubmissions - previousSubmissions,
        },
        views: {
          total: analytics?.total_views || 0,
          thisWeek: currentViews,
          trend: currentViews - previousViews,
        },
        conversion: {
          rate:
            (analytics?.total_views || 0) > 0
              ? ((analytics?.total_submissions || 0) /
                  (analytics?.total_views || 1)) *
                100
              : 0,
          trend:
            (currentViews > 0 ? currentSubmissions / currentViews : 0) -
            (previousViews > 0 ? previousSubmissions / previousViews : 0),
        },
      },
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
      user_id: form.user_id ? form.user_id.toString() : undefined,
    };
  }
}
