import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError as CustomValidationError } from '@core/errors/index.js';

export const validate = (
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dataToValidate = req[source];
      const validated = await schema.parseAsync(dataToValidate);

      (req as unknown as Record<string, unknown>)[source] = validated;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};

        error.issues.forEach((err) => {
          const path = err.path.join('.');
          (errors[path] ??= []).push(err.message);
        });

        next(new CustomValidationError('Validation failed', errors));
        return;
      }

      next(error);
    }
  };
};

export const validateMultiple = (schemas: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      if (schemas.query) {
        // @ts-expect-error - Assigning validated data to query
        req.query = await schemas.query.parseAsync(req.query);
      }

      if (schemas.params) {
        // @ts-expect-error - Assigning validated data to params
        req.params = await schemas.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};

        error.issues.forEach((err) => {
          const path = err.path.join('.');
          (errors[path] ??= []).push(err.message);
        });

        next(new CustomValidationError('Validation failed', errors));
        return;
      }

      next(error);
    }
  };
};
