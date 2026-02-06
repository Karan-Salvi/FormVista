import { Request, Response, NextFunction } from 'express';
import { FormService } from './form.service.js';
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
} from '@core/utils/response.util.js';
import { getUser } from '@core/middlewares/auth.middleware.js';

export class FormController {
  static async createForm(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const result = await FormService.createForm(user.userId, req.body);
      sendCreated(res, result.data, result.message, req);
    } catch (error) {
      next(error);
    }
  }

  static async getForms(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const result = await FormService.getForms(user.userId);
      sendSuccess(res, result.data, undefined, req);
    } catch (error) {
      next(error);
    }
  }

  static async getFormBySlug(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slug } = req.params as { slug: string };
      const result = await FormService.getFormBySlug(slug);
      sendSuccess(res, result.data, undefined, req);
    } catch (error) {
      next(error);
    }
  }

  static async getFormById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const result = await FormService.getFormById(id, user.userId);
      sendSuccess(res, result.data, undefined, req);
    } catch (error) {
      next(error);
    }
  }

  static async updateForm(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      const result = await FormService.updateForm(id, user.userId, req.body);
      sendSuccess(res, result.data, result.message, req);
    } catch (error) {
      next(error);
    }
  }

  static async deleteForm(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { id } = req.params as { id: string };
      await FormService.deleteForm(id, user.userId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  // Blocks
  static async addBlock(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { formId } = req.params as { formId: string };
      const result = await FormService.addBlock(formId, user.userId, req.body);
      sendCreated(res, result.data, result.message, req);
    } catch (error) {
      next(error);
    }
  }

  static async getBlocks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { formId } = req.params as { formId: string };
      const result = await FormService.getBlocks(formId);
      sendSuccess(res, result.data, undefined, req);
    } catch (error) {
      next(error);
    }
  }

  static async updateBlock(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Potentially check if user owns form here as well,
      // but for brevity sticking to basic implementation
      const { blockId } = req.params as { blockId: string };
      const result = await FormService.updateBlock(blockId, req.body);
      sendSuccess(res, result.data, result.message, req);
    } catch (error) {
      next(error);
    }
  }

  static async deleteBlock(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { blockId } = req.params as { blockId: string };
      await FormService.deleteBlock(blockId);
      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  // Submissions
  static async submitResponse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { slug } = req.params as { slug: string };
      const result = await FormService.submitResponse(slug, req.body);
      sendCreated(res, null, result.message, req);
    } catch (error) {
      next(error);
    }
  }

  static async getResponses(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { formId } = req.params as { formId: string };
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;
      const result = await FormService.getResponses(
        formId,
        user.userId,
        page,
        limit
      );
      sendSuccess(res, result.data, undefined, req);
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const result = await FormService.getDashboardStats(user.userId);
      sendSuccess(res, result.data, undefined, req);
    } catch (error) {
      next(error);
    }
  }

  static async getFormStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = getUser(req);
      const { formId } = req.params as { formId: string };
      const result = await FormService.getFormStats(formId, user.userId);
      sendSuccess(res, result.data, undefined, req);
    } catch (error) {
      next(error);
    }
  }
}
