import { Body, Controller, Post } from '@nestjs/common';

import { LoginDto, RefreshDto, RegisterDto } from '../dto/auth.dto';
import {
  LoginUseCase,
  RefreshTokensUseCase,
  RegisterUseCase,
} from 'src/application/usecases/auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshTokensUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.registerUseCase.execute(dto.username, dto.email, dto.password);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.usernameOrEmail, dto.password);
  }

  @Post('refresh')
  async refresh(@Body() dto: RefreshDto) {
    return this.refreshUseCase.execute(dto.refreshToken);
  }
}
