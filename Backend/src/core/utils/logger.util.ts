import winston from 'winston';
import { loggerConfig } from '@config/logger.config.js';

class Logger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger(loggerConfig);
  }

  public info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  public error(
    message: string,
    error?: Error | unknown,
    meta?: Record<string, unknown>
  ): void {
    if (error instanceof Error) {
      this.logger.error(message, {
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        ...meta,
      });
    } else {
      this.logger.error(message, { error, ...meta });
    }
  }

  public debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }

  public http(message: string, meta?: Record<string, unknown>): void {
    this.logger.http(message, meta);
  }
}

export const logger = new Logger();
