import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export interface EmailVerificationData {
  email: string;
  displayName: string;
  verificationUrl: string;
  expirationHours: number;
}

export interface PasswordResetData {
  email: string;
  displayName: string;
  resetUrl: string;
  expirationHours: number;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private emailVerificationTemplate!: handlebars.TemplateDelegate;
  private passwordResetTemplate!: handlebars.TemplateDelegate;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
    this.loadTemplates();
  }

  private initializeTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const smtpSecure = this.configService.get<boolean>('SMTP_SECURE', false);

    // Allow forcing email off in development/testing environments
    const disableEmail = this.configService.get<string>('DISABLE_EMAIL_SENDING') === 'true'
      || this.configService.get<string>('NODE_ENV') === 'test';

    if (disableEmail) {
      this.logger.warn('Email sending disabled by configuration (DISABLE_EMAIL_SENDING=true or NODE_ENV=test).');
      this.transporter = null;
      return;
    }

    if (!smtpHost || !smtpUser || !smtpPass) {
      this.logger.warn('SMTP configuration missing. Email functionality will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection (non-blocking)
    this.transporter.verify((error, success) => {
      if (error) {
        // Do not throw; allow app to boot without email sending
        this.logger.error('SMTP connection failed (email sending disabled):', error as Error);
        this.transporter = null;
        return;
      }
      this.logger.log('SMTP connection established successfully');
    });
  }

  /**
   * Resolve the templates directory in a robust way:
   * 1) EMAIL_TEMPLATE_DIR env override (absolute or relative to CWD)
   * 2) dist-relative: ../../templates/email (when running compiled code)
   * 3) src-relative fallback (when running ts-node): resolve towards src/templates/email
   * 4) project-root fallback using process.cwd()
   */
  private resolveTemplatesDir(): string {
    const envDir = this.configService.get<string>('EMAIL_TEMPLATE_DIR');
    if (envDir) {
      const absEnv = path.isAbsolute(envDir) ? envDir : path.resolve(process.cwd(), envDir);
      if (fs.existsSync(absEnv)) {
        this.logger.log(`Email templates dir resolved from EMAIL_TEMPLATE_DIR: ${absEnv}`);
        return absEnv;
      } else {
        this.logger.warn(`EMAIL_TEMPLATE_DIR set but not found at ${absEnv}`);
      }
    }

    // dist build relative (e.g., .../dist/modules/auth -> ../../templates/email -> .../dist/templates/email)
    const distGuess = path.resolve(__dirname, '../../templates/email');
    if (fs.existsSync(distGuess)) {
      this.logger.log(`Email templates dir resolved (dist guess): ${distGuess}`);
      return distGuess;
    }

    // src fallback (e.g., .../src/modules/auth -> ../../templates/email -> .../src/templates/email)
    const srcGuess = path.resolve(__dirname, '../../../src/templates/email');
    if (fs.existsSync(srcGuess)) {
      this.logger.log(`Email templates dir resolved (src fallback): ${srcGuess}`);
      return srcGuess;
    }

    // project root fallback (monorepo aware)
    // Try apps/backend/src/templates/email from CWD
    const cwdSrcGuess = path.resolve(process.cwd(), 'apps/backend/src/templates/email');
    if (fs.existsSync(cwdSrcGuess)) {
      this.logger.log(`Email templates dir resolved (cwd src): ${cwdSrcGuess}`);
      return cwdSrcGuess;
    }

    // Try apps/backend/dist/templates/email from CWD
    const cwdDistGuess = path.resolve(process.cwd(), 'apps/backend/dist/templates/email');
    if (fs.existsSync(cwdDistGuess)) {
      this.logger.log(`Email templates dir resolved (cwd dist): ${cwdDistGuess}`);
      return cwdDistGuess;
    }

    // Finally, try relative to current file but walking up to project root heuristically
    const upTwoToRoot = path.resolve(__dirname, '../../../');
    const rootSrcGuess = path.resolve(upTwoToRoot, 'src/templates/email');
    if (fs.existsSync(rootSrcGuess)) {
      this.logger.log(`Email templates dir resolved (root src heuristic): ${rootSrcGuess}`);
      return rootSrcGuess;
    }

    // Nothing found
    const tried = [envDir, distGuess, srcGuess, cwdSrcGuess, cwdDistGuess, rootSrcGuess].filter(Boolean).join(' | ');
    throw new Error(`Email templates directory not found. Tried: ${tried}`);
  }

  private loadTemplates() {
    try {
      const templatesPath = this.resolveTemplatesDir();

      const readTemplate = (name: string) => {
        const filePath = path.join(templatesPath, name);
        if (!fs.existsSync(filePath)) {
          throw new Error(`Template file not found at ${filePath}`);
        }
        return fs.readFileSync(filePath, 'utf8');
      };

      // Load email verification template
      const emailVerificationSource = readTemplate('email-verification.hbs');
      this.emailVerificationTemplate = handlebars.compile(emailVerificationSource);

      // Load password reset template
      const passwordResetSource = readTemplate('password-reset.hbs');
      this.passwordResetTemplate = handlebars.compile(passwordResetSource);

      this.logger.log(`Email templates loaded successfully from: ${templatesPath}`);
    } catch (error) {
      this.logger.error('Failed to load email templates:', error as Error);
      throw new Error('Email templates could not be loaded');
    }
  }

  async sendEmailVerification(data: EmailVerificationData): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Email transporter not configured. Skipping email verification.');
      return;
    }

    try {
      const html = this.emailVerificationTemplate(data);

      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM', 'noreply@focipedia.com'),
        to: data.email,
        subject: 'Focipedia - Email Megerősítés',
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email verification sent to ${data.email}. Message ID: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email verification to ${data.email}:`, error as Error);
      throw new Error('Failed to send email verification');
    }
  }

  async sendPasswordReset(data: PasswordResetData): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Email transporter not configured. Skipping password reset email.');
      return;
    }

    try {
      const html = this.passwordResetTemplate(data);

      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM', 'noreply@focipedia.com'),
        to: data.email,
        subject: 'Focipedia - Jelszó Visszaállítás',
        html,
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${data.email}. Message ID: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${data.email}:`, error as Error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendTestEmail(to: string): Promise<void> {
    if (!this.transporter) {
      throw new Error('Email transporter not configured');
    }

    try {
      const mailOptions = {
        from: this.configService.get<string>('SMTP_FROM', 'noreply@focipedia.com'),
        to,
        subject: 'Focipedia - Test Email',
        html: '<h1>Test Email</h1><p>This is a test email from Focipedia.</p>',
      };

      const result = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Test email sent to ${to}. Message ID: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send test email to ${to}:`, error as Error);
      throw new Error('Failed to send test email');
    }
  }
}