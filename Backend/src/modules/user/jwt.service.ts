import jwt from 'jsonwebtoken';
import { appConfig } from '@config/app.config.js';
import { logger } from '@core/utils/logger.util.js';
import type { JwtPayload } from './user.types.js';

export class JwtService {
  private static readonly SECRET = appConfig.jwt.secret;
  private static readonly EXPIRES_IN = appConfig.jwt.expiresIn;

  static generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.SECRET, {
      expiresIn: this.EXPIRES_IN as string,
    } as jwt.SignOptions);
  }

  static verifyToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, this.SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      logger.error('JWT verification error', error);
      return null;
    }
  }

  static decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      return decoded;
    } catch (error) {
      logger.error('JWT decode error', error);
      return null;
    }
  }
}
