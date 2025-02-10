import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './seed/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const seedService = app.get(SeedService);
  await seedService.seed();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
