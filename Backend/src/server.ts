// import app from './app.js';
// import { appConfig } from './config/app.config.js';
// import { logger } from './core/utils/logger.util.js';
// import { connectDatabase, disconnectDatabase } from './database/index.js';

// async function startServer() {
//   try {
//     await connectDatabase();

//     const PORT = appConfig.server.port;
//     const HOST = appConfig.server.host;

//     app.listen(PORT, HOST, () => {
//       logger.info(`Server running on http://${HOST}:${PORT}`);
//       logger.info(`Environment: ${appConfig.server.env}`);
//       logger.info(`API Prefix: ${appConfig.api.prefix}`);
//     });
//   } catch (error) {
//     logger.error('Failed to start server', error);
//     process.exit(1);
//   }
// }

// async function gracefulShutdown(signal: string) {
//   logger.info(`${signal} received. Starting graceful shutdown...`);

//   try {
//     logger.info('Disconnecting from database...');
//     await disconnectDatabase();
//     logger.info('Database disconnected successfully');
//   } catch (error) {
//     logger.error('Error during database disconnection', error);
//   }

//   logger.info('Shutting down server...');
//   process.exit(0);
// }

// process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// process.on('uncaughtException', (error) => {
//   logger.error('Uncaught Exception', error);
//   gracefulShutdown('uncaughtException');
// });

// process.on('unhandledRejection', (reason, promise) => {
//   logger.error('Unhandled Rejection', reason as Error, {
//     promise: String(promise),
//   });
//   gracefulShutdown('unhandledRejection');
// });

// startServer();

// export default app;

import { createApp } from './app.js';

// @ts-expect-error BigInt does not have toJSON method in TS lib
BigInt.prototype.toJSON = function (): string {
  return this.toString();
};
import { appConfig } from '@config/index.js';
import { logger } from '@core/utils/logger.util.js';
import { connectDatabase, disconnectDatabase } from './database/index.js';

const app = createApp();

async function initializeDatabase(): Promise<boolean> {
  try {
    await connectDatabase();

    logger.info('Database connected successfully');
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.warn(`Database connection attempt failed: ${errorMessage}`);
  }

  return false;
}

async function startServer() {
  try {
    const dbConnected = await initializeDatabase();

    if (!dbConnected) {
      logger.warn(
        'WARNING: Server is starting without database connection. Database operations will fail.'
      );
    }

    const PORT = appConfig.server.port;
    const HOST = appConfig.server.host;

    app.listen(PORT, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`);
      logger.info(`Environment: ${appConfig.server.env}`);
      logger.info(`API Prefix: ${appConfig.api.prefix}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  try {
    logger.info('Disconnecting from database...');
    await disconnectDatabase();
    logger.info('Database disconnected successfully');
  } catch (error) {
    logger.error('Error during database disconnection', error);
  }

  logger.info('Shutting down server...');
  process.exit(0);
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', reason as Error, {
    promise: String(promise),
  });
  gracefulShutdown('unhandledRejection');
});

startServer();

export default app;
