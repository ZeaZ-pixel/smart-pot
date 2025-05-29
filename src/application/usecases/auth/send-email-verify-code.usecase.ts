import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
  ) {}
  async execute(userId: number): Promise<string> {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const code = String(array[0] % 1_000_000).padStart(6, '0');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
    const emailConfirmation = new EmailConfirmationEntity(
      null,
      code,
      EmailCodeType.VERIFY_EMAIL,
      expiresAt,
      userId,
      false,
      0,
    );
    const emailConf =
      await this.emailConfirmationRepo.create(emailConfirmation);
    const message = `
        <h1>Подтверждение Email</h1>
        <p>Ваш код: <strong>${emailConf.code}</strong></p>
        <p>Он действителен 10 минут.</p>
      `;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.isVerified) {
      throw new BadRequestException('User already verified');
    }
    await this.emailSenderService.send(
      user.email,
      'Подтверждение Email',
      message,
    );
    return 'Code sended';
  }
}
