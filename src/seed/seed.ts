import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CronJob, CronJobDocument } from '../models/cron-job.schema';
import { Webhook, WebhookDocument } from '../models/webhook.schema';

const sampleCronJobs = [
  {
    name: 'Daily Backup',
    link: 'https://api.example.com/backup',
    apiKey: 'sk_test_backup123',
    schedule: '0 0 * * *',
    startDate: new Date(),
    isActive: true,
    history: [
      {
        triggeredAt: new Date(Date.now() - 86400000),
        response: { status: 'backup completed', files: 156 },
        status: 'success'
      }
    ]
  },
  {
    name: 'Weekly Report',
    link: 'https://api.example.com/report',
    apiKey: 'sk_test_report456',
    schedule: '0 8 * * 1',
    startDate: new Date(),
    isActive: true,
    history: [
      {
        triggeredAt: new Date(Date.now() - 604800000),
        response: { status: 'report generated', pages: 12 },
        status: 'success'
      }
    ]
  },
  {
    name: 'System Health Check',
    link: 'https://api.example.com/health',
    apiKey: 'sk_test_health789',
    schedule: '*/30 * * * *',
    startDate: new Date(),
    isActive: true,
    history: [
      {
        triggeredAt: new Date(Date.now() - 1800000),
        response: { status: 'healthy', metrics: { cpu: '23%', memory: '45%' } },
        status: 'success'
      }
    ]
  }
];

const sampleWebhooks = [
  {
    data: {
      event: 'backup_completed',
      timestamp: new Date(Date.now() - 86400000),
      details: { size: '1.2GB', files: 156 }
    }
  },
  {
    data: {
      event: 'report_generated',
      timestamp: new Date(Date.now() - 604800000),
      details: { type: 'weekly', pages: 12 }
    }
  },
  {
    data: {
      event: 'health_check',
      timestamp: new Date(Date.now() - 1800000),
      details: { status: 'healthy', metrics: { cpu: '23%', memory: '45%' } }
    }
  }
];

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(CronJob.name) private cronJobModel: Model<CronJobDocument>,
    @InjectModel(Webhook.name) private webhookModel: Model<WebhookDocument>
  ) {}

  async seed() {
    try {
      console.log('Starting database seed...');
      
      // Clear existing data
      await Promise.all([
        this.cronJobModel.deleteMany({}),
        this.webhookModel.deleteMany({})
      ]);
      
      // Insert cron jobs
      const jobs = await this.cronJobModel.insertMany(sampleCronJobs);
      
      // Insert webhooks with references
      const webhooksWithRefs = sampleWebhooks.map((webhook, index) => ({
        ...webhook,
        cronJobId: jobs[index]?._id?.toString(),
        createdAt: new Date(webhook.data.timestamp)
      }));
      
      const webhooks = await this.webhookModel.insertMany(webhooksWithRefs);
      
      console.log('Seed completed successfully!');
      console.log(`Created ${jobs.length} cron jobs and ${webhooks.length} webhooks`);
      
      return { jobs, webhooks };
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }
}