import mongoose from 'mongoose';
import { databaseConfig } from '@config/database.config.js';
import { logger } from '@core/utils/logger.util.js';

export const connectDatabase = async (): Promise<void> => {
  try {
    const { url, connection } = databaseConfig;

    if (!url) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      logger.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('Mongoose disconnected');
    });

    await mongoose.connect(url, {
      ...connection,
    } as mongoose.ConnectOptions);

    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error during database disconnection:', error);
  }
};
