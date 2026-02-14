import { Resend } from 'resend';
import { env } from '../../config/env.config.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '@core/utils/logger.util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = new Resend(env.RESEND_API_KEY);
const FROM_EMAIL = env.RESEND_FROM_EMAIL;

export class EmailService {
  private static async getTemplate(
    templateName: string,
    replacements: Record<string, string>
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'templates',
      templateName
    );
    let html = await fs.readFile(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(replacements)) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return html;
  }

  static async sendVerificationEmail(
    email: string,
    name: string,
    token: string
  ) {
    try {
      const link = `${env.FRONTEND_URL}/verify-email?token=${token}`;
      const html = await this.getTemplate('verify-email.html', { name, link });

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify your email for FormVista',
        html,
      });

      if (error) {
        logger.error('Resend API error sending verification email', {
          error,
          email,
        });
        throw new Error(`Failed to send verification email: ${error.message}`);
      }

      logger.info(`Verification email sent to ${email}`, {
        messageId: data?.id,
      });
    } catch (error) {
      logger.error('Error in sendVerificationEmail', error);
      throw error;
    }
  }

  static async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string
  ) {
    try {
      const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;
      const html = await this.getTemplate('reset-password.html', {
        name,
        link,
      });

      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Reset your password for FormVista',
        html,
      });

      if (error) {
        logger.error('Resend API error sending password reset email', {
          error,
          email,
        });
        throw new Error(
          `Failed to send password reset email: ${error.message}`
        );
      }

      logger.info(`Password reset email sent to ${email}`, {
        messageId: data?.id,
      });
    } catch (error) {
      logger.error('Error in sendPasswordResetEmail', error);
      throw error;
    }
  }
}
