import { Redis } from 'ioredis';
import { env } from './env.config.js';
import { logger } from '@core/utils/logger.util.js';

const redisClient = new Redis(env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('connect', () => {
  logger.info('Redis connected');
});

redisClient.on('error', (err) => {
  logger.error('Redis error', err);
});

export default redisClient;
