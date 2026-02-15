import { Request, Response, NextFunction } from 'express';
import { AuthService } from './user.service.js';
import {
  sendSuccess,
  sendUnauthorized,
  sendCreated,
} from '@core/utils/response.util.js';
import {
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from '@core/errors/index.js';

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

  static async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        throw new ValidationError('Invalid verification token');
      }

      await AuthService.verifyEmail(token);

      sendSuccess(
        res,
        { message: 'Email verified successfully' },
        'Email verified successfully',
        req
      );
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      if (!email) {
        throw new ValidationError('Email is required');
      }

      await AuthService.forgotPassword(email);

      sendSuccess(
        res,
        { message: 'Password reset email sent' },
        'Password reset email sent',
        req
      );
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        throw new ValidationError('Token and password are required');
      }

      await AuthService.resetPassword(token, password);

      sendSuccess(
        res,
        { message: 'Password reset successfully' },
        'Password reset successfully',
        req
      );
    } catch (error) {
      next(error);
    }
  }
  static async resendVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError();
      }

      try {
        await AuthService.resendVerification(req.user.userId);
      } catch (error: any) {
        // If it's a domain verification or service error, return a specific error message
        if (
          error.message.includes('not verified') ||
          error.message.includes('Failed to send')
        ) {
          throw new ValidationError(error.message);
        }
        throw error;
      }

      sendSuccess(
        res,
        { message: 'Verification email resent successfully' },
        'Verification email resent successfully',
        req
      );
    } catch (error) {
      next(error);
    }
  }
}
