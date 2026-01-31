import { Request, Response } from 'express';
import {
  BaseResponse,
  SuccessResponse,
  ErrorResponse,
  PaginatedResponse,
  PaginatedData,
  PaginationMeta,
  ResponseMeta,
  ErrorDetails,
  ValidationError,
  HttpStatus,
  ErrorCode,
} from './response.types.js';

import { env } from '@config/env.config.js';

const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

const extractRequestId = (req?: Request): string | undefined => {
  if (req) {
    const extendedReq = req as Request & { id?: string; requestId?: string };
    return extendedReq.id || extendedReq.requestId || generateRequestId();
  }
  return generateRequestId();
};

const extractStartTime = (req?: Request): number | undefined => {
  if (req) {
    return (req as Request & { startTime?: number }).startTime;
  }
  return undefined;
};

const createMeta = (
  req?: Request,
  pagination?: PaginationMeta,
  explicitRequestId?: string,
  explicitStartTime?: number
): ResponseMeta => {
  const meta: ResponseMeta = {
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || '1.0.0',
  };

  const requestId = explicitRequestId || extractRequestId(req);
  const startTime =
    explicitStartTime !== undefined ? explicitStartTime : extractStartTime(req);

  if (requestId) {
    meta.requestId = requestId;
  }

  if (pagination) {
    meta.pagination = pagination;
  }

  if (startTime) {
    meta.duration = Date.now() - startTime;
  }

  return meta;
};

export const calculatePagination = (
  page: number,
  limit: number,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  req?: Request
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
    meta: createMeta(req),
  };

  res.status(HttpStatus.OK).json(response);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message?: string,
  req?: Request
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message: message || 'Resource created successfully',
    data,
    meta: createMeta(req),
  };

  res.status(HttpStatus.CREATED).json(response);
};

export const sendAccepted = (
  res: Response,
  message?: string,
  req?: Request
): void => {
  const response: BaseResponse = {
    success: true,
    message: message || 'Request accepted for processing',
    meta: createMeta(req),
  };

  res.status(HttpStatus.ACCEPTED).json(response);
};

export const sendNoContent = (res: Response): void => {
  res.status(HttpStatus.NO_CONTENT).send();
};

export const sendPaginated = <T>(
  res: Response,
  items: T[],
  pagination: PaginationMeta,
  message?: string,
  req?: Request
): void => {
  const paginatedData: PaginatedData<T> = {
    items,
    pagination,
  };

  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data: paginatedData,
    meta: createMeta(req, pagination),
  };

  res.status(HttpStatus.OK).json(response);
};

export const sendError = (
  res: Response,
  statusCode: HttpStatus,
  errorCode: ErrorCode,
  message: string,
  details?: Record<string, unknown>,
  req?: Request,
  stack?: string
): void => {
  const error: ErrorDetails = {
    code: errorCode,
    message,
    ...(details && { details }),
  };

  if (stack && env.NODE_ENV === 'development') {
    error.stack = stack;
  }

  const response: ErrorResponse = {
    success: false,
    error,
    meta: createMeta(req),
  };

  res.status(statusCode).json(response);
};

export const sendBadRequest = (
  res: Response,
  message: string,
  details?: Record<string, unknown>,
  req?: Request
): void => {
  sendError(
    res,
    HttpStatus.BAD_REQUEST,
    ErrorCode.BAD_REQUEST,
    message,
    details,
    req
  );
};

export const sendUnauthorized = (
  res: Response,
  message: string = 'Unauthorized access',
  req?: Request
): void => {
  sendError(
    res,
    HttpStatus.UNAUTHORIZED,
    ErrorCode.UNAUTHORIZED,
    message,
    undefined,
    req
  );
};

export const sendForbidden = (
  res: Response,
  message: string = 'Forbidden: Insufficient permissions',
  req?: Request
): void => {
  sendError(
    res,
    HttpStatus.FORBIDDEN,
    ErrorCode.FORBIDDEN,
    message,
    undefined,
    req
  );
};

export const sendNotFound = (
  res: Response,
  message: string = 'Resource not found',
  req?: Request
): void => {
  sendError(
    res,
    HttpStatus.NOT_FOUND,
    ErrorCode.NOT_FOUND,
    message,
    undefined,
    req
  );
};

export const sendConflict = (
  res: Response,
  message: string,
  details?: Record<string, unknown>,
  req?: Request
): void => {
  sendError(
    res,
    HttpStatus.CONFLICT,
    ErrorCode.CONFLICT,
    message,
    details,
    req
  );
};

export const sendValidationError = (
  res: Response,
  errors: ValidationError[],
  message: string = 'Validation failed',
  req?: Request
): void => {
  const details = {
    validationErrors: errors,
  };

  sendError(
    res,
    HttpStatus.UNPROCESSABLE_ENTITY,
    ErrorCode.VALIDATION_ERROR,
    message,
    details,
    req
  );
};

export const sendRateLimitError = (
  res: Response,
  message: string = 'Too many requests. Please try again later.',
  retryAfter?: number,
  req?: Request
): void => {
  const details = retryAfter ? { retryAfter } : undefined;

  sendError(
    res,
    HttpStatus.TOO_MANY_REQUESTS,
    ErrorCode.RATE_LIMIT_EXCEEDED,
    message,
    details,
    req
  );
};

export const sendInternalError = (
  res: Response,
  message: string = 'Internal server error',
  error?: Error,
  req?: Request
): void => {
  const details: Record<string, unknown> = {};

  if (error) {
    details.error = error.message;
    if (env.NODE_ENV === 'development') {
      details.stack = error.stack;
    }
  }

  sendError(
    res,
    HttpStatus.INTERNAL_SERVER_ERROR,
    ErrorCode.INTERNAL_ERROR,
    message,
    details,
    req,
    error?.stack
  );
};

export const sendDatabaseError = (
  res: Response,
  message: string = 'Database operation failed',
  error?: Error,
  req?: Request
): void => {
  const details: Record<string, unknown> = {};

  if (error) {
    details.error = error.message;
    if (env.NODE_ENV === 'development') {
      details.stack = error.stack;
    }
  }

  sendError(
    res,
    HttpStatus.INTERNAL_SERVER_ERROR,
    ErrorCode.DATABASE_ERROR,
    message,
    details,
    req,
    error?.stack
  );
};

export const sendServiceUnavailable = (
  res: Response,
  message: string = 'Service temporarily unavailable',
  req?: Request
): void => {
  sendError(
    res,
    HttpStatus.SERVICE_UNAVAILABLE,
    ErrorCode.SERVICE_UNAVAILABLE,
    message,
    undefined,
    req
  );
};
