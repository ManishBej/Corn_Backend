import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CronJob, CronJobDocument, ICronJob } from '../models/cron-job.schema';
import { CreateCronJobDto } from '../dto/create-cron-job.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob as CronJobSchedule } from 'cron';
import axios from 'axios';

@Injectable()
export class CronJobService {
  private readonly logger = new Logger(CronJobService.name);

  constructor(
    @InjectModel(CronJob.name) private cronJobModel: Model<CronJobDocument>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async create(createCronJobDto: CreateCronJobDto): Promise<CronJobDocument> {
    const createdCronJob = new this.cronJobModel(createCronJobDto);
    const savedJob = await createdCronJob.save();
    this.scheduleCronJob(savedJob);
    return savedJob;
  }

  async findAll(): Promise<CronJobDocument[]> {
    const jobs = await this.cronJobModel.find().exec();
    return jobs;
  }

  async findOne(id: string): Promise<CronJobDocument> {
    const job = await this.cronJobModel.findById(id).exec();
    if (!job) {
      throw new NotFoundException(`Cron job with ID "${id}" not found`);
    }
    return job;
  }

  async update(id: string, updateCronJobDto: CreateCronJobDto): Promise<CronJobDocument> {
    const updatedJob = await this.cronJobModel
      .findByIdAndUpdate(id, updateCronJobDto, { new: true })
      .exec();
    
    if (!updatedJob) {
      throw new NotFoundException(`Cron job with ID "${id}" not found`);
    }

    this.deleteCronJob(id);
    this.scheduleCronJob(updatedJob);
    return updatedJob;
  }

  async delete(id: string): Promise<CronJobDocument> {
    const deletedJob = await this.cronJobModel.findByIdAndDelete(id).exec();
    if (!deletedJob) {
      throw new NotFoundException(`Cron job with ID "${id}" not found`);
    }
    this.deleteCronJob(id);
    return deletedJob;
  }

  private scheduleCronJob(job: CronJobDocument) {
    const cronJob = new CronJobSchedule(job.schedule, async () => {
      try {
        const response = await axios.get(job.link, {
          headers: { 'Authorization': job.apiKey }
        });

        const history = {
          triggeredAt: new Date(),
          response: response.data,
          status: 'success'
        };

        await this.cronJobModel.findByIdAndUpdate(
          job._id,
          { $push: { history: history } }
        ).exec();

        this.logger.log(`Cron job ${job.name} executed successfully`);
      } catch (error) {
        const history = {
          triggeredAt: new Date(),
          response: error.message,
          status: 'error'
        };

        await this.cronJobModel.findByIdAndUpdate(
          job._id,
          { $push: { history: history } }
        ).exec();

        this.logger.error(`Error executing cron job ${job.name}: ${error.message}`);
      }
    });

    this.schedulerRegistry.addCronJob(job._id.toString(), cronJob);
    cronJob.start();
  }

  private deleteCronJob(jobId: string) {
    try {
      const job = this.schedulerRegistry.getCronJob(jobId);
      job.stop();
      this.schedulerRegistry.deleteCronJob(jobId);
    } catch (error) {
      this.logger.warn(`Cron job ${jobId} not found in registry`);
    }
  }
}