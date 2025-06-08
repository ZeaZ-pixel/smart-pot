import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmailSenderServiceImpl } from 'src/application/services/email-sender.service.impl';
import { EmailConfirmationEntity } from 'src/domain/entities/email-confirmation.entity';
import { IEmailConfirmationRepository } from 'src/domain/repositories/email-confirmation.repository';
import { EmailCodeType } from 'src/domain/types/email-code-type.enum';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/user.repository.impl';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendResetPasswordCodeUseCase {
  constructor(
    @Inject('EmailConfirmationRepository')
    private readonly emailConfirmationRepo: IEmailConfirmationRepository,
    @Inject('EmailSenderService')
    private readonly emailSenderService: EmailSenderServiceImpl,
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryImpl,
    private readonly configService: ConfigService,
  ) {}

  async execute(email: string): Promise<{
    message: string;
    codeLifetime: number;
    maxAttempts: number;
  }> {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const code = String(array[0] % 1_000_000).padStart(6, '0');
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
    const expiresAt = new Date(Date.now() + codeConfig.expiresInSeconds * 1000);
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const emailConfirmation =
      await this.emailConfirmationRepo.findByUserIdAndType(
        user.id!,
        EmailCodeType.RESET_PASSWORD,
      );
    if (!emailConfirmation) {
      await this.emailConfirmationRepo.create(
        new EmailConfirmationEntity(
          null,
          code,
          EmailCodeType.RESET_PASSWORD,
          expiresAt,
          user.id!,
          false,
          0,
        ),
      );
    } else {
      if (emailConfirmation.attemptCount > 5) {
        throw new BadRequestException('Too many attempts');
      }
      await this.emailConfirmationRepo.resetCode(
        user.id!,
        EmailCodeType.RESET_PASSWORD,
        code,
        expiresAt,
      );
      await this.emailConfirmationRepo.incrementAttemptCount(
        emailConfirmation.id!,
      );
    }

    const message = `
        <h1>Сброс пароля</h1>
        <p>Ваш код: <strong>${code}</strong></p>
        <p>Он действителен 10 минут.</p>
      `;

    await this.emailSenderService.send(user.email, 'Сброс пароля', message);
    return {
      message: 'Password reset code has been sent successfully',
      codeLifetime: codeConfig.expiresInSeconds,
      maxAttempts: codeConfig.maxAttempts,
    };
  }
}
