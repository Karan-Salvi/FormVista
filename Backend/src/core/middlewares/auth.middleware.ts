import { Request, Response, NextFunction } from 'express';
import { AuthenticationError, AuthorizationError } from '@core/errors/index.js';
import { logger } from '@core/utils/logger.util.js';
import { JwtService } from '@/modules/user/jwt.service.js';
import type { AuthenticatedUser } from '@shared/types/auth.types.js';

/**
 * Middleware to authenticate requests using JWT.
 * Sets the decoded user information on req.user.
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError(
        'Authentication required. No token provided.'
      );
    }

    const token = authHeader.substring(7);
    const decoded = JwtService.verifyToken(token);

    if (!decoded) {
      throw new AuthenticationError('Invalid or expired token.');
    }

    const user: AuthenticatedUser = {
      userId: decoded.userId,
      email: decoded.email,
      plan: decoded.plan as 'free' | 'pro',
      role: decoded.role as 'user' | 'admin',
    };

    // Set user on request
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
      return;
    }

    logger.error('Authentication error', error);
    next(new AuthenticationError('Authentication failed.'));
  }
};

/**
 * Middleware to restrict access based on user role.
 */
export const requireRole = (role: 'user' | 'admin') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required.');
      }

      if (req.user.role !== role) {
        throw new AuthorizationError(`Access denied. ${role} role required.`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware to restrict access based on user plan (e.g., 'pro').
 */
export const requirePlan = (plan: 'free' | 'pro') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Authentication required.');
      }

      // If 'pro' is required, only 'pro' users can access.
      // If 'free' is required, anyone (free or pro) can access.
      if (plan === 'pro' && req.user.plan !== 'pro') {
        throw new AuthorizationError('This feature requires a Pro plan.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Helper to get the authenticated user from the request or throw an error.
 */
export function getUser(req: Request): AuthenticatedUser {
  if (!req.user) {
    throw new AuthenticationError('Authentication required.');
  }
  return req.user;
}
