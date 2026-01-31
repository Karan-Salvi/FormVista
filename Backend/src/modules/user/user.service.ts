import { PasswordUtil } from '@core/utils/password.util.js';
import { logger } from '@core/utils/logger.util.js';
import { JwtService } from './jwt.service.js';
import UserModel from './user.model.js';
import type {
  LoginRequest,
  AuthResponse,
  JwtPayload,
  RegisterRequest,
  UserResponseData,
} from './user.types.js';
import { AuthenticationError, ValidationError } from '@core/errors/index.js';

export class AuthService {
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const { name, email, password } = data;

      const existingUser = await UserModel.findOne({
        email: email.toLowerCase(),
      });
      if (existingUser) {
        throw new ValidationError('User with this email already exists');
      }

      const password_hash = PasswordUtil.hashPassword(password);

      const user = await UserModel.create({
        name,
        email: email.toLowerCase(),
        password_hash,
      });

      const tokenPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
        userId: user.id || (user as any)._id.toString(),
        email: user.email,
        plan: user.plan,
      };

      const token = JwtService.generateToken(tokenPayload);

      logger.info('User registered successfully', { userId: user.id });

      return {
        success: true,
        message: 'Registration successful',
        data: {
          token,
          user: this.mapUser(user),
        },
      };
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      logger.error('Registration error', error);
      return {
        success: false,
        message: 'An error occurred during registration.',
      };
    }
  }

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const { email, password } = credentials;

      const user = await UserModel.findOne({ email: email.toLowerCase() });

      if (!user) {
        throw new AuthenticationError('Invalid email or password.');
      }

      const isPasswordValid = PasswordUtil.verifyPassword(
        password,
        user.password_hash
      );

      if (!isPasswordValid) {
        logger.warn('Failed login attempt', {
          email: email,
          reason: 'incorrect_password',
        });
        throw new AuthenticationError('Invalid email or password.');
      }

      const tokenPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
        userId: user.id || (user as any)._id.toString(),
        email: user.email,
        plan: user.plan,
      };

      const token = JwtService.generateToken(tokenPayload);

      logger.info('Successful login', { userId: user.id });

      return {
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: this.mapUser(user),
        },
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      logger.error('Login error', error);
      return {
        success: false,
        message: 'An error occurred during login.',
      };
    }
  }

  static async getUserById(userId: string): Promise<UserResponseData | null> {
    const user = await UserModel.findById(userId);
    return user ? this.mapUser(user) : null;
  }

  private static mapUser(user: any): UserResponseData {
    return {
      id: user.id || user._id.toString(),
      name: user.name,
      email: user.email,
      plan: user.plan,
      is_email_verified: user.is_email_verified,
    };
  }

  static verifyToken(token: string): JwtPayload | null {
    return JwtService.verifyToken(token);
  }
}
