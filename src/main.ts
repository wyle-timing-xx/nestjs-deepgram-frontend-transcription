import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 使用验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // 设置CORS
  app.enableCors();

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('Frontend Audio Transcription API')
    .setDescription('API for transcribing audio files with frontend-related content detection')
    .setVersion('1.0')
    .addTag('transcription')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // 配置文件上传限制
  const maxFileSize = process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) * 1024 * 1024 : 10 * 1024 * 1024; // 默认10MB
  app.use(express.json({ limit: maxFileSize }));
  app.use(express.urlencoded({ extended: true, limit: maxFileSize }));

  // 启动应用
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();