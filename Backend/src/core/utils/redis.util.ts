import redisClient from '@config/redis.config.js';

export const getOrSetCache = async <T>(
  key: string,
  cb: () => Promise<T>
): Promise<T> => {
  const cached = await redisClient.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const freshData = await cb();
  // Set with expiration (EX) of 3600 seconds (1 hour)
  await redisClient.set(key, JSON.stringify(freshData), 'EX', 3600);
  return freshData;
};
