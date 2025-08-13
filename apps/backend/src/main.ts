import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './prisma/prisma-exception.filter';

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
