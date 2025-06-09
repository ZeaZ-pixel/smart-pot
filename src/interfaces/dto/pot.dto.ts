import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePotDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  temperature: number;

  @ApiProperty()
  @IsNumber()
  humidity: number;

  @ApiProperty()
  @IsNumber()
  soilMoisture: number;

  @ApiProperty()
  @IsNumber()
  photoresistor: number;

  @ApiProperty()
  @IsNumber()
  waterSensor: number;

  @ApiProperty()
  @IsNumber()
  vitaminSensor: number;

  @ApiProperty()
  @IsNumber()
  PHValue: number;
}

export class EditPotDto {
  @ApiProperty()
  @IsNumber()
  temperature: number;

  @ApiProperty()
  @IsNumber()
  humidity: number;

  @ApiProperty()
  @IsNumber()
  soilMoisture: number;

  @ApiProperty()
  @IsNumber()
  photoresistor: number;

  @ApiProperty()
  @IsNumber()
  waterSensor: number;

  @ApiProperty()
  @IsNumber()
  vitaminSensor: number;

  @ApiProperty()
  @IsNumber()
  PHValue: number;

  @ApiProperty()
  timestamp: Date;
}
