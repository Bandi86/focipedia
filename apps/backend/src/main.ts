import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma/prisma-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor(15000));

  const config = new DocumentBuilder()
    .setTitle('Focipedia API')
    .setDescription('The Focipedia API description')
    .setVersion('1.0')
    .addTag('focipedia')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.enableShutdownHooks();

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
}
bootstrap();
