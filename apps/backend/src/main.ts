import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  app.use(
    csurf({ 
      cookie: true,
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    }),
  );
  
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

  // CORS configuration
  const corsConfig = configService.get('cors');
  app.enableCors({
    origin: corsConfig.origin,
    credentials: corsConfig.credentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
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