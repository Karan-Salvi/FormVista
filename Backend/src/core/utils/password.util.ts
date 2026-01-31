import { createHmac } from 'crypto';
import { appConfig } from '@config/app.config.js';

export class PasswordUtil {
  static hashPassword(password: string): string {
    const key = appConfig.passwords.adSuperSecret;

    if (!key) {
      throw new Error('AD_SUPER_SECRET is missing in environment variables');
    }

    return createHmac('sha256', key).update(password).digest('hex');
  }

  static verifyPassword(password: string, storedHash: string): boolean {
    try {
      const hash = this.hashPassword(password);
      return hash === storedHash;
    } catch (_error) {
      return false;
    }
  }
}
