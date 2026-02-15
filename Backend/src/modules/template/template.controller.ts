import { Request, Response, NextFunction } from 'express';
import { TemplateService } from './template.service.js';
import { AuthenticatedUser } from '@/shared/types/auth.types.js';

export class TemplateController {
  static async createTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await TemplateService.createTemplate(req.body);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getTemplates(_req: Request, res: Response, next: NextFunction) {
    try {
      const response = await TemplateService.getTemplates();
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getTemplateById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await TemplateService.getTemplateById(
        req.params.id as string
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async createFormFromTemplate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { templateId, title } = req.body;
      const userId = (req.user as AuthenticatedUser).userId;
      const response = await TemplateService.createFormFromTemplate(
        userId,
        templateId,
        title
      );
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async deleteTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await TemplateService.deleteTemplate(
        req.params.id as string
      );
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
