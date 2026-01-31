export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserResponseData {
  id: string;
  name: string;
  email: string;
  plan: string;
  is_email_verified: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: UserResponseData;
  };
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  data?: UserResponseData;
}

export interface JwtPayload {
  userId: string;
  email: string;
  plan: string;
  iat?: number;
  exp?: number;
}
