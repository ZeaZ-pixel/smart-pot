import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { isValidEmail } from 'src/application/utils/isValidEmail';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IAuthService } from 'src/domain/services/auth.service';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: IUserRepository,
    @Inject('AuthService') private readonly authService: IAuthService,
  ) {}

  async execute(
    usernameOrEmail: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    let user: UserEntity | null = null;
    if (isValidEmail(usernameOrEmail)) {
      user = await this.userRepo.findByEmail(usernameOrEmail);
      console.log(user?.isVerified);
      if (!user || !user.isVerified)
        throw new BadRequestException('Email not found');
    } else {
      user = await this.userRepo.findByUsername(usernameOrEmail);
      if (!user || !user.isVerified)
        throw new BadRequestException('Username not found');
    }

    const match = await this.authService.compare(password, user.password);

    if (!match) throw new BadRequestException('Invalid password');
    if (user.id === null) {
      throw new BadRequestException('User ID was not assigned by the database');
    }
    const accessToken = this.authService.generateAccessToken(user.id);
    const refreshToken = this.authService.generateRefreshToken(user.id);
    const hashedRefreshToken = await this.authService.hash(refreshToken);
    user.setRefreshToken(hashedRefreshToken);
    await this.userRepo.updateRefreshToken(user.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  }
}
