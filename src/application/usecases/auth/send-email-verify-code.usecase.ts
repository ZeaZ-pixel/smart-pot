import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailSenderServiceImpl } from 'src/application/services/email-sender.service.impl';
import { EmailConfirmationEntity } from 'src/domain/entities/email-confirmation.entity';
import { IEmailConfirmationRepository } from 'src/domain/repositories/email-confirmation.repository';
import { EmailCodeType } from 'src/domain/types/email-code-type.enum';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/user.repository.impl';

@Injectable()
export class SendEmailVerifyCodeUseCase {
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
    console.log(emailCodeConfig);
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

    if (user.isVerified) {
      throw new BadRequestException('User already verified');
    }

    const emailConfirmation =
      await this.emailConfirmationRepo.findByUserIdAndType(
        user.id!,
        EmailCodeType.VERIFY_EMAIL,
      );
    if (!emailConfirmation) {
      await this.emailConfirmationRepo.create(
        new EmailConfirmationEntity(
          null,
          code,
          EmailCodeType.VERIFY_EMAIL,
          expiresAt,
          user.id!,
          false,
          0,
        ),
      );
    } else {
      await this.emailConfirmationRepo.resetCode(
        user.id!,
        EmailCodeType.VERIFY_EMAIL,
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
      message: 'Email confirm code has been sent successfully',
      codeLifetime: codeConfig.expiresInSeconds,
      maxAttempts: codeConfig.maxAttempts,
    };
  }
}
