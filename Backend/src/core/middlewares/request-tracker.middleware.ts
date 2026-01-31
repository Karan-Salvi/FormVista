import { Request, Response, NextFunction } from 'express';
import { logger } from '@core/utils/logger.util.js';

declare module 'express-serve-static-core' {
  interface Request {
    id?: string;
    requestId?: string;
    startTime?: number;
  }
}

const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const requestTracker = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestId = generateRequestId();
  const startTime = Date.now();
  req.id = requestId;
  req.requestId = requestId;
  req.startTime = startTime;

  res.setHeader('X-Request-ID', requestId);

  logger.http(`${req.method} ${req.path}`, {
    requestId,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.http(`${req.method} ${req.path} - ${res.statusCode}`, {
      requestId,
      duration,
      statusCode: res.statusCode,
    });
  });

  next();
};
