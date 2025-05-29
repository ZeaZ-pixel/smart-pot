import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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
  ) {}
  async execute(
    userId: number,
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const emailConfirmation = await this.emailConfirmationRepo.findByCode(
      userId,
      code,
      EmailCodeType.VERIFY_EMAIL,
    );
    if (!emailConfirmation || code !== emailConfirmation.code) {
      throw new BadRequestException('Invalid code');
    }
    await this.emailConfirmationRepo.incrementAttemptCount(
      emailConfirmation.id!,
    );
    await this.emailConfirmationRepo.markAsUsed(emailConfirmation.id!);
    const user = await this.userRepository.verifyUserEmail(userId);
    if (!user || user.id === null) {
      throw new BadRequestException('User ID was not assigned by the database');
    }
    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);
    const hashedRefreshToken = await this.authService.hash(refreshToken);
    user.setRefreshToken(hashedRefreshToken);
    await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  }
}
