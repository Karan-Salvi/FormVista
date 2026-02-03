import { env } from './env.config.js';

export const appConfig = {
  server: {
    port: env.PORT,
    host: env.HOST,
    env: env.NODE_ENV,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  },

  cors: {
    origin: env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },

  passwords: {
    adSuperSecret: env.AD_SUPER_SECRET,
  },

  logging: {
    level: env.LOG_LEVEL,
  },

  api: {
    prefix: '/api',
    version: 'v1',
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX_REQUESTS,
    message:
      'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  },
} as const;

export type AppConfig = typeof appConfig;
