import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebhookController } from './webhook.controller';
import { Webhook, WebhookSchema } from '../models/webhook.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Webhook.name, schema: WebhookSchema }
    ])
  ],
  controllers: [WebhookController]
})
export class WebhookModule {}