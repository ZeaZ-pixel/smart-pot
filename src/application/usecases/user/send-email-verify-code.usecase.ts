import { Inject, Injectable } from '@nestjs/common';
import { EmailConfirmationEntity } from 'src/domain/entities/email-confirmation.entity';
import { IEmailConfirmationRepository } from 'src/domain/repositories/email-confirmation.repository';
import { EmailCodeType } from 'src/domain/types/email-code-type.enum';

@Injectable()
export class SendEmailVerifyCodeUseCase {
  constructor(
    @Inject('EmailConfirmationRepository')
    private readonly emailConfirmationRepo: IEmailConfirmationRepository,
  ) {}
  async execute(userId: number) {
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
    await this.emailConfirmationRepo.create(emailConfirmation);
  }
}
