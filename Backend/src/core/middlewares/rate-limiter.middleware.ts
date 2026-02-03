import { rateLimit } from 'express-rate-limit';
import { appConfig } from '@config/index.js';

export const rateLimiter = rateLimit({
  windowMs: appConfig.rateLimit.windowMs,
  max: appConfig.rateLimit.max,
  message: {
    success: false,
    message: appConfig.rateLimit.message,
  },
  standardHeaders: appConfig.rateLimit.standardHeaders,
  legacyHeaders: appConfig.rateLimit.legacyHeaders,
});
