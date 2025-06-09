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

export class ConnectPotDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class CreatePotCommandDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  payload: string;
}

export class EditPotImageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  imageBase64: string;
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
