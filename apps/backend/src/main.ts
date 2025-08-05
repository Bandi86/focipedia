import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  // Configure Helmet for SPA/API dev: avoid policies that break cross-origin dev
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // disable strict CSP in dev or adjust if needed
    }),
  );

  // CSRF configuration:
  // For API-first backend with cross-origin frontend and credentialed requests,
  // disable CSRF entirely in development to avoid misconfiguration issues.
  // In production, prefer token-based CSRF for same-origin forms only.
  const nodeEnv = configService.get<string>('server.nodeEnv') || process.env.NODE_ENV || 'development';
  if (nodeEnv !== 'production') {
    // Disable CSRF in dev for all routes (API only)
    // Note: Keep this consistent with SPA setup using JWTs/cookies.
  } else {
    // If you need CSRF protection for server-rendered forms in prod, enable here,
    // but exclude the API prefix to not break SPA/API requests.
    const csrfProtection = csurf({
      cookie: true,
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    });
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path?.startsWith('/api')) {
        return next();
      }
      return csrfProtection(req, res, next);
    });
  }

  // Rate limiting
  const rateLimitConfig = configService.get('security');
  app.use(
    rateLimit({
      windowMs: rateLimitConfig.rateLimitWindowMs,
      max: rateLimitConfig.rateLimitMaxRequests,
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // CORS configuration (mirror exact Origin; never wildcard)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ];

  // IMPORTANT: Use origin function so Nest sets Access-Control-Allow-Origin to the exact Origin header
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // allow same-origin/no-origin (curl, server-to-server) and our frontend
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.log(`CORS blocked for origin: ${origin}`);
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['Set-Cookie'],
  } as CorsOptions);

  // Force preflight response headers explicitly and ensure no wildcard is ever returned
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'OPTIONS') {
      const reqOrigin = (req.headers.origin as string | undefined);
      if (!reqOrigin || allowedOrigins.includes(reqOrigin)) {
        res.setHeader('Access-Control-Allow-Origin', reqOrigin || allowedOrigins[0]);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
        return res.sendStatus(204);
      }
    }
    return next();
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger/OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Focipedia API')
    .setDescription('Focipedia Football Community Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('profiles', 'Profile management endpoints')
    .addTag('settings', 'User settings endpoints')
    .addTag('health', 'Health check endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get('server.port');
  await app.listen(port);
  
  console.log(`🚀 Focipedia API is running on: http://localhost:${port}`);
  console.log(`📖 API documentation available at: http://localhost:${port}/docs`);
  console.log(`🔧 Environment: ${configService.get('server.nodeEnv')}`);
}
bootstrap();