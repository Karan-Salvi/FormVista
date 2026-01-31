import { AppError } from './AppError.js';

export class AuthorizationError extends AppError {
  constructor(
    message: string = 'You do not have permission to access this resource'
  ) {
    super(message, 403, true, 'AUTHORIZATION_ERROR');
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}
