import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IAuthService } from 'src/domain/services/auth.service';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: IUserRepository,
    @Inject('AuthService') private readonly authService: IAuthService,
  ) {}

  async execute(
    username: string,
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) throw new BadRequestException('User already exists');

    const hash = await this.authService.hash(password);
    const user = new UserEntity(null, username, email, hash, false);

    const savedUser = await this.userRepo.save(user);
    if (savedUser.id === null) {
      throw new BadRequestException('User ID was not assigned by the database');
    }

    const accessToken = this.authService.generateAccessToken(savedUser.id);
    const refreshToken = this.authService.generateRefreshToken(savedUser.id);
    const hashedRefreshToken = await this.authService.hash(refreshToken);
    savedUser.setRefreshToken(hashedRefreshToken);
    await this.userRepo.updateRefreshToken(savedUser.id, hashedRefreshToken);

    return { accessToken, refreshToken };
  }
}
