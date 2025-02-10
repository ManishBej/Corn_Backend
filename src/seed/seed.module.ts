import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed';
import { CronJob, CronJobSchema } from '../models/cron-job.schema';
import { Webhook, WebhookSchema } from '../models/webhook.schema';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: CronJob.name, schema: CronJobSchema },
      { name: Webhook.name, schema: WebhookSchema }
    ])
  ],
  providers: [SeedService],
  exports: [SeedService]
})
export class SeedModule {}