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
    const existingByEmail = await this.userRepo.findByEmail(email);
    const existingByUsername = await this.userRepo.findByUsername(username);
    const now = new Date();

    if (existingByEmail?.isVerified) {
      throw new BadRequestException('Email already in use');
    }

    if (
      existingByUsername &&
      existingByUsername.email !== email &&
      existingByUsername.isVerified
    ) {
      throw new BadRequestException('Username already in use');
    }

    const hashedPassword = await this.authService.hash(password);

    if (existingByEmail) {
      existingByEmail.username = username;
      existingByEmail.password = hashedPassword;
      existingByEmail.updatedAt = now;

      const updated = await this.userRepo.save(existingByEmail);

      return new RegisterResponseDto(
        updated.id!,
        updated.email,
        updated.username,
      );
    }

    const user = new UserEntity(null, username, email, hashedPassword, false);

    const savedUser = await this.userRepo.save(user);
    if (savedUser.id === null) {
      throw new BadRequestException('User ID was not assigned by the database');
    }

    return new RegisterResponseDto(
      savedUser.id,
      savedUser.email,
      savedUser.username,
    );
  }
}
