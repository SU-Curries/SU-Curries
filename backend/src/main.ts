import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Create the app with appropriate logging level
  const app = await NestFactory.create(AppModule, {
    logger: isDevelopment ? ['log', 'debug', 'error', 'warn'] : ['error', 'warn'],
  });
  
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: isDevelopment ? false : undefined,
    crossOriginEmbedderPolicy: !isDevelopment,
  }));
  
  // Compression for better performance
  app.use(compression());
  
  // Rate limiting
  const rateLimitWindow = configService.get('RATE_LIMIT_WINDOW') || 15 * 60 * 1000; // 15 minutes
  const rateLimitMax = configService.get('RATE_LIMIT_MAX') || 100;
  
  app.use(
    rateLimit({
      windowMs: rateLimitWindow,
      max: rateLimitMax,
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // CORS configuration
  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3000';
  app.enableCors({
    origin: [frontendUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      disableErrorMessages: !isDevelopment,
    }),
  );

  // Swagger API documentation - only in development
  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle('SU Curries API')
      .setDescription('Complete API documentation for SU Curries food platform')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get('PORT') || 3001;
  await app.listen(port);
  
  logger.log(`🚀 SU Curries API is running on: http://localhost:${port}`);
  if (isDevelopment) {
    logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  }
}

bootstrap();