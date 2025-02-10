import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export interface ICronJob {
  name: string;
  link: string;
  apiKey: string;
  schedule: string;
  startDate: Date;
  isActive: boolean;
  history: Array<{
    triggeredAt: Date;
    response: any;
    status: string;
  }>;
}

export type CronJobDocument = HydratedDocument<ICronJob>;

@Schema({ timestamps: true })
export class CronJob implements ICronJob {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  apiKey: string;

  @Prop({ required: true })
  schedule: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop([{
    triggeredAt: { type: Date },
    response: { type: Object },
    status: { type: String }
  }])
  history: Array<{
    triggeredAt: Date;
    response: any;
    status: string;
  }>;
}

export const CronJobSchema = SchemaFactory.createForClass(CronJob);