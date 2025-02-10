import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateCronJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @IsString()
  @IsNotEmpty()
  schedule: string;

  @IsDateString()
  startDate: string;
}