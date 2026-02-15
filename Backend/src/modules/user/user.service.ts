import { PasswordUtil } from '@core/utils/password.util.js';
import { logger } from '@core/utils/logger.util.js';
import { JwtService } from './jwt.service.js';
import UserModel, { IUser } from './user.model.js';
import type {
  LoginRequest,
  AuthResponse,
  JwtPayload,
  RegisterRequest,
  UserResponseData,
} from './user.types.js';
import crypto from 'crypto';
import { EmailService } from '../../services/email/email.service.js';
import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
} from '@core/errors/index.js';

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

      const verificationToken = crypto.randomBytes(32).toString('hex');

      const user = await UserModel.create({
        name,
        email: email.toLowerCase(),
        password_hash,
        email_verification_token: verificationToken,
        is_email_verified: false,
      });

      const tokenPayload: Omit<JwtPayload, 'iat' | 'exp'> = {
        userId: user.id || user._id.toString(),
        email: user.email,
        plan: user.plan,
        role: user.role,
      };

      const token = JwtService.generateToken(tokenPayload);

      try {
        await EmailService.sendVerificationEmail(
          user.email,
          user.name,
          verificationToken
        );
      } catch (emailError) {
        logger.error(
          'Failed to send verification email during registration',
          emailError
        );
        // We still return success: true because the user account was created.
        // But we warn them about the email.
        return {
          success: true,
          message:
            "Account created, but we couldn't send the verification email. Please try resending it from your dashboard.",
          data: {
            token,
            user: this.mapUser(user),
          },
        };
      }

      logger.info('User registered successfully', { userId: user.id });

      return {
        success: true,
        message:
          'Registration successful. Please check your email to verify your account.',
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
        userId: user.id || user._id.toString(),
        email: user.email,
        plan: user.plan,
        role: user.role,
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

  static async verifyEmail(token: string): Promise<UserResponseData> {
    const user = await UserModel.findOne({ email_verification_token: token });
    if (!user) {
      throw new ValidationError('Invalid verification token');
    }

    user.is_email_verified = true;
    user.email_verification_token = undefined;
    await user.save();
    return this.mapUser(user);
  }

  static async resendVerification(userId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.is_email_verified) {
      throw new ValidationError('Email is already verified');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.email_verification_token = verificationToken;
    await user.save();

    await EmailService.sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.reset_password_token = resetToken;
    user.reset_password_expires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    await EmailService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetToken
    );
  }

  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const user = await UserModel.findOne({
      reset_password_token: token,
      reset_password_expires: { $gt: Date.now() },
    });

    if (!user) {
      throw new ValidationError('Invalid or expired password reset token');
    }

    user.password_hash = PasswordUtil.hashPassword(newPassword);
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;
    await user.save();
  }

  private static mapUser(user: IUser): UserResponseData {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      plan: user.plan,
      role: user.role,
      is_email_verified: user.is_email_verified,
    };
  }

  static verifyToken(token: string): JwtPayload | null {
    return JwtService.verifyToken(token);
  }
}
