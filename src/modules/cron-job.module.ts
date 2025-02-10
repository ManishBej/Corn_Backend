import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronJobController } from './cron-job.controller';
import { CronJobService } from './cron-job.service';
import { CronJob, CronJobSchema } from '../models/cron-job.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CronJob.name, schema: CronJobSchema }]),
  ],
  controllers: [CronJobController],
  providers: [CronJobService],
})
export class CronJobModule {}