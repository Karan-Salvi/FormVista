import { Request, Response, NextFunction } from 'express';
import { AppError } from '@core/errors/index.js';
import { logger } from '@core/utils/logger.util.js';
import { sendError } from '@core/utils/response.util.js';
import { ErrorCode, HttpStatus } from '@core/utils/response.types.js';
import { ZodError } from 'zod';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const errors = err.issues.map((error) => ({
      field: error.path.join('.'),
      message: error.message,
    }));

    logger.warn('Zod validation error', {
      path: req.path,
      method: req.method,
      errors,
      requestBody: req.body,
    });

    sendError(
      res,
      HttpStatus.BAD_REQUEST,
      ErrorCode.VALIDATION_ERROR,
      'Validation failed',
      { validationErrors: errors },
      req
    );
    return;
  }

  if (err instanceof AppError) {
    logger.warn('Application error', {
      path: req.path,
      method: req.method,
      statusCode: err.statusCode,
      message: err.message,
      errorCode: err.errorCode,
      errors: 'errors' in err ? err.errors : undefined,
      requestBody: req.body,
    });

    const details =
      'errors' in err && err.errors
        ? {
            validationErrors: Object.entries(err.errors).map(
              ([field, messages]) => ({
                field,
                message: messages[0] || 'Validation failed',
              })
            ),
          }
        : undefined;

    sendError(
      res,
      err.statusCode,
      (err.errorCode || ErrorCode.INTERNAL_ERROR) as ErrorCode,
      err.message,
      details,
      req,
      err.stack
    );
    return;
  }

  logger.error('Unhandled error', err, {
    path: req.path,
    method: req.method,
  });

  sendError(
    res,
    HttpStatus.INTERNAL_SERVER_ERROR,
    ErrorCode.INTERNAL_ERROR,
    'An unexpected error occurred',
    undefined,
    req,
    err.stack
  );
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  sendError(
    res,
    HttpStatus.NOT_FOUND,
    ErrorCode.NOT_FOUND,
    `Route ${req.method} ${req.path} not found`,
    undefined,
    req
  );
};
