import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../config/database.providers';
import * as crypto from 'crypto';

export interface TokenValidationResult {
  isValid: boolean;
  userId?: string;
  error?: string;
}

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Generate a secure random token
   */
  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create an email verification token
   */
  async createEmailVerificationToken(userId: string): Promise<string> {
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiration

    try {
      // Delete any existing tokens for this user
      await this.prisma.emailVerificationToken.deleteMany({
        where: { userId },
      });

      // Create new token
      await this.prisma.emailVerificationToken.create({
        data: {
          userId,
          token,
          expiresAt,
        },
      });

      this.logger.log(`Email verification token created for user ${userId}`);
      return token;
    } catch (error) {
      this.logger.error(`Failed to create email verification token for user ${userId}:`, error);
      throw new Error('Failed to create email verification token');
    }
  }

  /**
   * Validate and consume an email verification token
   */
  async validateEmailVerificationToken(token: string): Promise<TokenValidationResult> {
    try {
      const tokenRecord = await this.prisma.emailVerificationToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!tokenRecord) {
        return { isValid: false, error: 'Token not found' };
      }

      if (tokenRecord.expiresAt < new Date()) {
        // Clean up expired token
        await this.prisma.emailVerificationToken.delete({
          where: { id: tokenRecord.id },
        });
        return { isValid: false, error: 'Token expired' };
      }

      // Token is valid, mark user as verified and delete token
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: tokenRecord.userId },
          data: { isVerified: true },
        }),
        this.prisma.emailVerificationToken.delete({
          where: { id: tokenRecord.id },
        }),
      ]);

      this.logger.log(`Email verified for user ${tokenRecord.userId}`);
      return { isValid: true, userId: tokenRecord.userId };
    } catch (error) {
      this.logger.error(`Failed to validate email verification token:`, error);
      return { isValid: false, error: 'Token validation failed' };
    }
  }

  /**
   * Create a password reset token
   */
  async createPasswordResetToken(userId: string): Promise<string> {
    const token = this.generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

    try {
      // Delete any existing tokens for this user
      await this.prisma.passwordResetToken.deleteMany({
        where: { userId },
      });

      // Create new token
      await this.prisma.passwordResetToken.create({
        data: {
          userId,
          token,
          expiresAt,
        },
      });

      this.logger.log(`Password reset token created for user ${userId}`);
      return token;
    } catch (error) {
      this.logger.error(`Failed to create password reset token for user ${userId}:`, error);
      throw new Error('Failed to create password reset token');
    }
  }

  /**
   * Validate a password reset token (without consuming it)
   */
  async validatePasswordResetToken(token: string): Promise<TokenValidationResult> {
    try {
      const tokenRecord = await this.prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!tokenRecord) {
        return { isValid: false, error: 'Token not found' };
      }

      if (tokenRecord.expiresAt < new Date()) {
        // Clean up expired token
        await this.prisma.passwordResetToken.delete({
          where: { id: tokenRecord.id },
        });
        return { isValid: false, error: 'Token expired' };
      }

      return { isValid: true, userId: tokenRecord.userId };
    } catch (error) {
      this.logger.error(`Failed to validate password reset token:`, error);
      return { isValid: false, error: 'Token validation failed' };
    }
  }

  /**
   * Consume a password reset token (delete it after use)
   */
  async consumePasswordResetToken(token: string): Promise<TokenValidationResult> {
    try {
      const validation = await this.validatePasswordResetToken(token);
      
      if (!validation.isValid) {
        return validation;
      }

      // Delete the token after successful validation
      await this.prisma.passwordResetToken.delete({
        where: { token },
      });

      this.logger.log(`Password reset token consumed for user ${validation.userId}`);
      return validation;
    } catch (error) {
      this.logger.error(`Failed to consume password reset token:`, error);
      return { isValid: false, error: 'Token consumption failed' };
    }
  }

  /**
   * Clean up expired tokens (should be called periodically)
   */
  async cleanupExpiredTokens(): Promise<void> {
    try {
      const now = new Date();
      
      const [emailTokensDeleted, passwordTokensDeleted] = await this.prisma.$transaction([
        this.prisma.emailVerificationToken.deleteMany({
          where: { expiresAt: { lt: now } },
        }),
        this.prisma.passwordResetToken.deleteMany({
          where: { expiresAt: { lt: now } },
        }),
      ]);

      this.logger.log(
        `Cleaned up expired tokens: ${emailTokensDeleted.count} email verification, ${passwordTokensDeleted.count} password reset`
      );
    } catch (error) {
      this.logger.error('Failed to cleanup expired tokens:', error);
    }
  }

  /**
   * Resend email verification token
   */
  async resendEmailVerificationToken(userId: string): Promise<string> {
    try {
      // Check if user is already verified
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.isVerified) {
        throw new Error('User is already verified');
      }

      // Create new token (this will delete any existing ones)
      return await this.createEmailVerificationToken(userId);
    } catch (error) {
      this.logger.error(`Failed to resend email verification token for user ${userId}:`, error);
      throw error;
    }
  }
}