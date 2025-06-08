import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepositoryImpl } from 'src/infrastructure/repositories/user.repository.impl';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IEmailConfirmationRepository } from 'src/domain/repositories/email-confirmation.repository';
import { EmailCodeType } from 'src/domain/types/email-code-type.enum';
import { ConfigService } from '@nestjs/config';
import { IAuthService } from 'src/domain/services/auth.service';

@Injectable()
export class VerifyResetPasswordCodeUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepositoryImpl,
    @Inject('EmailConfirmationRepository')
    private readonly emailConfirmationRepo: IEmailConfirmationRepository,
    @Inject('AuthService') private readonly authService: IAuthService,

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
    if (emailConfirmation.expiresAt < new Date()) {
      throw new BadRequestException('Code expired');
    }
    const hashed = await this.authService.hash(password);

    return this.userRepository.changePassword(user.id!, hashed);
  }
}
