import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EmailSenderServiceImpl } from 'src/application/services/email-sender.service.impl';
import { isValidEmail } from 'src/application/utils/isValidEmail';
import { EmailConfirmationEntity } from 'src/domain/entities/email-confirmation.entity';
import { IEmailConfirmationRepository } from 'src/domain/repositories/email-confirmation.repository';
import { EmailCodeType } from 'src/domain/types/email-code-type.enum';

@Injectable()
export class SendEmailVerifyCodeUseCase {
  constructor(
    @Inject('EmailConfirmationRepository')
    private readonly emailConfirmationRepo: IEmailConfirmationRepository,
    @Inject('EmailSenderService')
    private readonly emailSenderService: EmailSenderServiceImpl,
  ) {}
  async execute(userId: number, email: string): Promise<string> {
    try {
      if (!isValidEmail(email)) {
        throw new BadRequestException('Email is not correct');
      }
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
      await this.emailSenderService.send(email, 'Подтверждение Email', message);
      return 'Code sended';
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'Failed to send the email message',
      );
    }
  }
}
