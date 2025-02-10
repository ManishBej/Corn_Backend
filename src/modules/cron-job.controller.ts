import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { CreateCronJobDto } from '../dto/create-cron-job.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('cron-jobs')
@UseGuards(ThrottlerGuard)
export class CronJobController {
  constructor(private readonly cronJobService: CronJobService) {}

  @Post()
  create(@Body() createCronJobDto: CreateCronJobDto) {
    return this.cronJobService.create(createCronJobDto);
  }

  @Get()
  findAll() {
    return this.cronJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cronJobService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCronJobDto: CreateCronJobDto) {
    return this.cronJobService.update(id, updateCronJobDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.cronJobService.delete(id);
  }
}