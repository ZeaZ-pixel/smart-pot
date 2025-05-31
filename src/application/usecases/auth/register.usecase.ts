import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IAuthService } from 'src/domain/services/auth.service';
import { RegisterResponseDto } from 'src/interfaces/dto/auth.dto';

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
  ): Promise<RegisterResponseDto> {
    const TTL_MS = 15 * 60 * 1000;
    const cutoff = new Date(Date.now() - TTL_MS);

    const existingByEmail = await this.userRepo.findByEmail(email);
    const existingByUsername = await this.userRepo.findByUsername(username);

    if (existingByEmail?.isVerified) {
      throw new BadRequestException('Email already in use');
    }

    if (
      existingByUsername &&
      existingByUsername.email !== email &&
      (existingByUsername.isVerified || existingByUsername.createdAt > cutoff)
    ) {
      throw new BadRequestException('Username already in use');
    }

    const hashed = await this.authService.hash(password);

    if (existingByEmail) {
      existingByEmail.username = username;
      existingByEmail.password = hashed;
      existingByEmail.updatedAt = new Date();

      const updated = await this.userRepo.save(existingByEmail);
      return new RegisterResponseDto(
        updated.id!,
        updated.email,
        updated.username,
      );
    }

    const newUser = new UserEntity(null, username, email, hashed, false);
    const saved = await this.userRepo.save(newUser);

    return new RegisterResponseDto(saved.id!, saved.email, saved.username);
  }
}
