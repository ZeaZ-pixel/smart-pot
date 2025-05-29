import { Body, Controller, Post } from '@nestjs/common';

import {
  EmailCodeDto,
  EmailCodeVerifyDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
} from '../dto/auth.dto';
import {
  LoginUseCase,
  RefreshTokensUseCase,
  RegisterUseCase,
  SendEmailVerifyCodeUseCase,
  VerifyEmailCodeUseCase,
} from 'src/application/usecases/auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshTokensUseCase,
    private readonly sendEmailVerifyCodeUseCase: SendEmailVerifyCodeUseCase,
    private readonly verifyEmailCodeUseCase: VerifyEmailCodeUseCase,
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

  @Post('email-code')
  async emailCode(@Body() dto: EmailCodeDto) {
    return this.sendEmailVerifyCodeUseCase.execute(dto.userId);
  }

  @Post('email-code/verify')
  async emailCodeVerify(@Body() dto: EmailCodeVerifyDto) {
    return this.verifyEmailCodeUseCase.execute(dto.userId, dto.code);
  }
}
