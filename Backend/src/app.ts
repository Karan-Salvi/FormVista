import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { appConfig } from '@config/index.js';
import {
  requestTracker,
  errorHandler,
  notFoundHandler,
} from '@core/middlewares/index.js';
import routes from './routes/index.js';

export function createApp(): Application {
  const app: Application = express();

  app.use(cors(appConfig.cors));

  if (appConfig.server.isDevelopment) {
    app.use(morgan('dev'));
  }

  app.use(requestTracker);

  app.use((req, res, next) => {
    if (req.path.includes('/webhook/')) {
      next();
    } else {
      express.json()(req, res, next);
    }
  });
  app.use(express.urlencoded({ extended: true }));

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      success: true,
      message: 'SMM Backend API',
      version: appConfig.api.version,
      apiPrefix: appConfig.api.prefix,
      endpoints: {
        api: appConfig.api.prefix,
        auth: `${appConfig.api.prefix}/auth`,
        schools: `${appConfig.api.prefix}/schools`,
        administrators: `${appConfig.api.prefix}/administrators`,
        documentRequirements: `${appConfig.api.prefix}/document-requirements`,
        paymentRequirements: `${appConfig.api.prefix}/payment-requirements`,
        payments: `${appConfig.api.prefix}/payments`,
        admissions: `${appConfig.api.prefix}/admissions`,
        enquiries: `${appConfig.api.prefix}/enquiries`,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  });

  app.use(appConfig.api.prefix, routes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
}
