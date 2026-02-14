import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z
    .string()
    .default('5000')
    .transform(Number)
    .pipe(z.number().positive()),
  HOST: z.string().default('localhost'),

  DATABASE_URL: z.string().url(),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  AD_SUPER_SECRET: z
    .string()
    .min(32, 'AD_SUPER_SECRET must be at least 32 characters'),

  CORS_ORIGIN: z
    .string()
    .default('*')
    .transform((val) => {
      if (val === '*') {
        return val;
      }
      const origins = val.split(',').map((origin) => origin.trim());
      if (origins.length === 1) {
        return origins[0];
      }
      return origins;
    }),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
  STRIPE_SUCCESS_URL: z.string().url(),
  STRIPE_CANCEL_URL: z.string().url(),

  REDIS_URL: z.string().optional(),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .default('900000')
    .transform(Number)
    .pipe(z.number().positive()),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .default('100')
    .transform(Number)
    .pipe(z.number().positive()),

  RESEND_API_KEY: z.string().startsWith('re_'),
  RESEND_FROM_EMAIL: z.string().email(),
  FRONTEND_URL: z.string().url(),
});

function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      // eslint-disable-next-line no-console
      console.error('Environment validation failed:');
      error.issues.forEach((err) => {
        // eslint-disable-next-line no-console
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;
