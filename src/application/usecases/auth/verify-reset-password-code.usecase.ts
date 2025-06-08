import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/user.repository.impl';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IEmailConfirmationRepository } from 'src/domain/repositories/email-confirmation.repository';
import { EmailCodeType } from 'src/domain/types/email-code-type.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerifyResetPasswordCodeUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryImpl,
    @Inject('EmailConfirmationRepository')
    private readonly emailConfirmationRepo: IEmailConfirmationRepository,
    private readonly configService: ConfigService,
  ) {}
  async execute(
    email: string,
    code: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const emailConfirmation = await this.emailConfirmationRepo.findActiveByCode(
      user.id!,
      code,
      EmailCodeType.RESET_PASSWORD,
    );
    if (!emailConfirmation) {
      throw new BadRequestException('Email confirmation not found');
    }
    if (emailConfirmation.code !== code) {
      throw new BadRequestException('Invalid code');
    }

    const resetPasswordConfig = this.configService.get<{
      code: { expiresInSeconds: number; maxAttempts: number };
    }>('resetPassword');
    if (!resetPasswordConfig) {
      throw new Error('Reset password configuration is not defined');
    }
    const codeConfig = resetPasswordConfig.code;
    if (!codeConfig) {
      throw new Error('Reset password code configuration is not defined');
    }
    if (emailConfirmation.attemptCount > codeConfig.maxAttempts) {
      throw new BadRequestException('Too many attempts');
    }
    if (emailConfirmation.expiresAt < new Date()) {
      throw new BadRequestException('Code expired');
    }
    return this.userRepository.changePassword(user.id!, password);
  }
}
