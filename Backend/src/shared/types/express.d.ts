import { AuthenticatedUser } from './auth.types.js';

declare global {
  namespace Express {
    interface Request {
      /** Set by authenticate middleware. */
      user?: AuthenticatedUser;
      id?: string;
      requestId?: string;
      startTime?: number;
    }
  }
}

export {};
