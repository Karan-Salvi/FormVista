import { Request, Response } from 'express';
import {
  sendSuccess,
  sendCreated,
  sendNotFound,
  sendBadRequest,
  sendInternalError,
  sendValidationError,
  sendPaginated,
} from './response.util.js';
import { ValidationError, PaginationMeta } from './response.types.js';

export const success = <T>(
  req: Request,
  res: Response,
  data: T,
  message?: string
): void => {
  sendSuccess(res, data, message, req);
};
export const created = <T>(
  req: Request,
  res: Response,
  data: T,
  message?: string
): void => {
  sendCreated(res, data, message, req);
};
export const notFound = (
  req: Request,
  res: Response,
  message?: string
): void => {
  sendNotFound(res, message, req);
};
export const badRequest = (
  req: Request,
  res: Response,
  message: string,
  details?: Record<string, unknown>
): void => {
  sendBadRequest(res, message, details, req);
};
export const internalError = (
  req: Request,
  res: Response,
  message?: string,
  error?: Error
): void => {
  sendInternalError(res, message, error, req);
};
export const validationError = (
  req: Request,
  res: Response,
  errors: ValidationError[],
  message?: string
): void => {
  sendValidationError(res, errors, message, req);
};
export const paginated = <T>(
  req: Request,
  res: Response,
  items: T[],
  pagination: PaginationMeta,
  message?: string
): void => {
  sendPaginated(res, items, pagination, message, req);
};
