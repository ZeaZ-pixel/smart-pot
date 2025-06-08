import { Body, Controller, Post } from '@nestjs/common';

import {
  EmailCodeDto,
  EmailCodeVerifyDto,
  LoginDto,
  RefreshDto,
  RegisterDto,
  ResetPasswordDto,
} from '../dto/auth.dto';
import {
  LoginUseCase,
  RefreshTokensUseCase,
  RegisterUseCase,
  SendEmailVerifyCodeUseCase,
  VerifyEmailCodeUseCase,
  VerifyResetPasswordCodeUseCase,
  SendResetPasswordCodeUseCase,
} from 'src/application/usecases/auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshTokensUseCase,
    private readonly sendEmailVerifyCodeUseCase: SendEmailVerifyCodeUseCase,
    private readonly verifyEmailCodeUseCase: VerifyEmailCodeUseCase,
    private readonly verifyResetPasswordCodeUseCase: VerifyResetPasswordCodeUseCase,
    private readonly sendResetPasswordCodeUseCase: SendResetPasswordCodeUseCase,
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
    return this.sendEmailVerifyCodeUseCase.execute(dto.email);
  }

  @Post('email-code/verify')
  async emailCodeVerify(@Body() dto: EmailCodeVerifyDto) {
    return this.verifyEmailCodeUseCase.execute(dto.email, dto.code);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: EmailCodeDto) {
    return this.sendResetPasswordCodeUseCase.execute(dto.email);
  }

  @Post('reset-password/verify')
  async sendResetPasswordCode(@Body() dto: ResetPasswordDto) {
    return this.verifyResetPasswordCodeUseCase.execute(
      dto.email,
      dto.code,
      dto.password,
    );
  }
}
