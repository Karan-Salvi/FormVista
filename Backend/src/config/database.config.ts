import { env } from './env.config.js';

export const databaseConfig = {
  url: env.DATABASE_URL,

  connection: {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  },

  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
} as const;

export type DatabaseConfig = typeof databaseConfig;
