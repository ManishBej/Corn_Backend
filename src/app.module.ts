import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronJobModule } from './modules/cron-job.module';
import { WebhookModule } from './modules/webhook.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/cron-jobs'),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot(),
    CronJobModule,
    WebhookModule,
    SeedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
