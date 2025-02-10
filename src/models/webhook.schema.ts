import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes } from 'mongoose';

export interface IWebhook {
  data: Record<string, any>;
  cronJobId?: string;
  createdAt: Date;
}

export type WebhookDocument = HydratedDocument<IWebhook>;

@Schema({ timestamps: true })
export class Webhook implements IWebhook {
  @Prop({ type: SchemaTypes.Mixed, required: true })
  data: Record<string, any>;

  @Prop({ type: String })
  cronJobId: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const WebhookSchema = SchemaFactory.createForClass(Webhook);