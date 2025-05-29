import {
  IsEmail,
  IsInt,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class RegisterResponseDto {
  constructor(
    public readonly id: number,
    public readonly email: string,
    public readonly username: string,
  ) {}
}

export class EmailCodeDto {
  @ApiProperty()
  @IsInt()
  userId: number;
}

export class EmailCodeVerifyDto {
  @ApiProperty()
  @IsInt()
  userId: number;

  @IsString()
  @MinLength(6)
  @MaxLength(6)
  code: string;
}

export class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class LoginDto {
  @ApiProperty()
  @IsString()
  usernameOrEmail: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;
}
