import { IsString, IsNumber, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  MONGODB_URI: string;

  @IsString()
  FRONTEND_URL: string;

  @IsNumber()
  PORT: number;
}