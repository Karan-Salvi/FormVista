import redisClient from '@config/redis.config.js';
import { logger } from '@core/utils/logger.util.js';

export class CacheMonitor {
  static async getRedisInfo(): Promise<Record<string, string>> {
    try {
      const info = await redisClient.info();
      const lines = info.split('\r\n');
      const result: Record<string, string> = {};

      for (const line of lines) {
        if (line && !line.startsWith('#')) {
          const [key, value] = line.split(':');
          if (key && value) {
            result[key] = value;
          }
        }
      }

      return result;
    } catch (error) {
      logger.error('Failed to get Redis info', error);
      throw error;
    }
  }

  static async getCacheStats(): Promise<{
    totalKeys: number;
    memoryUsed: string;
    hitRate: string;
    connectedClients: number;
  }> {
    try {
      const info = await this.getRedisInfo();

      return {
        totalKeys: await redisClient.dbsize(),
        memoryUsed: info['used_memory_human'] || 'N/A',
        hitRate: this.calculateHitRate(info),
        connectedClients: parseInt(info['connected_clients'] || '0', 10),
      };
    } catch (error) {
      logger.error('Failed to get cache stats', error);
      throw error;
    }
  }

  private static calculateHitRate(info: Record<string, string>): string {
    const hits = parseInt(info['keyspace_hits'] || '0', 10);
    const misses = parseInt(info['keyspace_misses'] || '0', 10);
    const total = hits + misses;

    if (total === 0) {
      return '0%';
    }

    const rate = ((hits / total) * 100).toFixed(2);
    return `${rate}%`;
  }

  static async getKeysByPattern(pattern: string): Promise<string[]> {
    try {
      return await redisClient.keys(pattern);
    } catch (error) {
      logger.error(`Failed to get keys for pattern: ${pattern}`, error);
      throw error;
    }
  }

  static async clearCacheByPattern(pattern: string): Promise<number> {
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }

      await redisClient.del(...keys);
      logger.info(`Cleared ${keys.length} cache keys matching: ${pattern}`);
      return keys.length;
    } catch (error) {
      logger.error(`Failed to clear cache for pattern: ${pattern}`, error);
      throw error;
    }
  }

  static async clearAllFormCaches(): Promise<number> {
    const patterns = ['form:*', 'forms:*', 'blocks:*', 'responses:*'];
    let totalCleared = 0;

    for (const pattern of patterns) {
      totalCleared += await this.clearCacheByPattern(pattern);
    }

    return totalCleared;
  }

  static async getKeyTTL(key: string): Promise<number> {
    try {
      return await redisClient.ttl(key);
    } catch (error) {
      logger.error(`Failed to get TTL for key: ${key}`, error);
      throw error;
    }
  }

  static async healthCheck(): Promise<boolean> {
    try {
      const result = await redisClient.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('Redis health check failed', error);
      return false;
    }
  }

  static async getCacheBreakdown(): Promise<{
    forms: number;
    blocks: number;
    responses: number;
    userForms: number;
    total: number;
  }> {
    try {
      const [formKeys, blockKeys, responseKeys, userFormKeys] =
        await Promise.all([
          redisClient.keys('form:*'),
          redisClient.keys('blocks:*'),
          redisClient.keys('responses:*'),
          redisClient.keys('forms:user:*'),
        ]);

      return {
        forms: formKeys.length,
        blocks: blockKeys.length,
        responses: responseKeys.length,
        userForms: userFormKeys.length,
        total: await redisClient.dbsize(),
      };
    } catch (error) {
      logger.error('Failed to get cache breakdown', error);
      throw error;
    }
  }
}
