import { Controller, Post, Body, Get, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Webhook, WebhookDocument } from '../models/webhook.schema';

@Controller('webhooks')
export class WebhookController {
  constructor(
    @InjectModel(Webhook.name) private webhookModel: Model<WebhookDocument>
  ) {}

  @Post()
  async create(@Body() data: Record<string, any>): Promise<WebhookDocument> {
    try {
      const webhook = new this.webhookModel({
        data,
        createdAt: new Date(),
      });
      return await webhook.save();
    } catch (error) {
      throw new InternalServerErrorException('Failed to create webhook record', error.message);
    }
  }

  @Get()
  async findAll(): Promise<WebhookDocument[]> {
    try {
      return await this.webhookModel.find().sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch webhook records', error.message);
    }
  }
}