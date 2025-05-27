import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserProfile } from 'src/domain/entities/user-profile.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async execute(user_id: number): Promise<UserProfile> {
    const user = await this.userRepo.findById(user_id);
    if (!user) throw new BadRequestException('User not found');
    return new UserProfile(user.username, user.email);
  }
}
