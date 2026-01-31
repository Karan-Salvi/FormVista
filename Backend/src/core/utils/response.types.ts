export interface BaseResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ErrorDetails;
  meta?: ResponseMeta;
}

export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  field?: string;
  stack?: string;
}

export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
  version?: string;
  pagination?: PaginationMeta;
  duration?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export type SuccessResponse<T = unknown> = BaseResponse<T> & {
  success: true;
  data: T;
  meta?: ResponseMeta;
};

export type ErrorResponse = BaseResponse & {
  success: false;
  error: ErrorDetails;
  meta?: ResponseMeta;
};

export type PaginatedResponse<T> = SuccessResponse<PaginatedData<T>>;

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
}

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  BAD_REQUEST = 'BAD_REQUEST',

  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
}
