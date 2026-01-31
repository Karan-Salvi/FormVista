import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  public readonly errors?: Record<string, string[]>;

  constructor(
    message: string = 'Validation failed',
    errors?: Record<string, string[]>
  ) {
    super(message, 400, true, 'VALIDATION_ERROR');
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
