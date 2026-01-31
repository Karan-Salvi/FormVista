import { Request, Response, NextFunction } from 'express';
import { AuthService } from './user.service.js';
import {
  sendSuccess,
  sendUnauthorized,
  sendCreated,
} from '@core/utils/response.util.js';
import { AuthenticationError, NotFoundError } from '@core/errors/index.js';

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register({ name, email, password });

      if (result.success && result.data) {
        sendCreated(res, result.data, result.message, req);
      } else {
        next(new Error(result.message));
      }
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new AuthenticationError('Please provide email and password.');
      }

      const result = await AuthService.login({ email, password });

      if (result.success && result.data) {
        sendSuccess(res, result.data, result.message, req);
      } else {
        sendUnauthorized(res, result.message, req);
      }
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError();
      }

      const user = await AuthService.getUserById(req.user.userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      sendSuccess(res, user, undefined, req);
    } catch (error) {
      next(error);
    }
  }
}
