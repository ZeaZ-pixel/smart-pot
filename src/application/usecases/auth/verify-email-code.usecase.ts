import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEmailConfirmationRepository } from 'src/domain/repositories/email-confirmation.repository';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IAuthService } from 'src/domain/services/auth.service';
import { EmailCodeType } from 'src/domain/types/email-code-type.enum';

@Injectable()
export class VerifyEmailCodeUseCase {
  constructor(
    @Inject('EmailConfirmationRepository')
    private readonly emailConfirmationRepo: IEmailConfirmationRepository,
    @Inject('UserRepository') private readonly userRepository: IUserRepository,
    @Inject('AuthService') private readonly authService: IAuthService,
    private readonly configService: ConfigService,
  ) {}
  async execute(
    email: string,
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const emailConfirmation = await this.emailConfirmationRepo.findActiveByCode(
      user.id!,
      code,
      EmailCodeType.VERIFY_EMAIL,
    );
    if (!emailConfirmation || code !== emailConfirmation.code) {
      throw new BadRequestException('Invalid code');
    }

    const emailCodeConfig = this.configService.get<{
      code: { expiresInSeconds: number; maxAttempts: number };
    }>('emailCodeConfig');
    if (!emailCodeConfig) {
      throw new InternalServerErrorException(
        'Email code configuration is not defined',
      );
    }
    const codeConfig = emailCodeConfig.code;
    if (!codeConfig) {
      throw new InternalServerErrorException(
        'Email code configuration is not defined',
      );
    }

    if (emailConfirmation.attemptCount > codeConfig.maxAttempts) {
      throw new BadRequestException('Too many attempts');
    }

    await this.emailConfirmationRepo.incrementAttemptCount(
      emailConfirmation.id!,
    );
    await this.emailConfirmationRepo.markAsUsed(emailConfirmation.id!);
    await this.userRepository.verifyUserEmail(email);
    const accessToken = this.authService.generateAccessToken(user.id!);
    const refreshToken = this.authService.generateRefreshToken(user.id!);
    const hashedRefreshToken = await this.authService.hash(refreshToken);
    user.setRefreshToken(hashedRefreshToken);
    await this.userRepository.updateRefreshToken(user.id!, hashedRefreshToken);

    return { accessToken, refreshToken };
  }
}
