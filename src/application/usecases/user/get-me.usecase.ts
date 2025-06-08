import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserProfileEntity } from 'src/domain/entities/user-profile.entity';
import { IUserProfileRepository } from 'src/domain/repositories/user-profile.repository';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject('UserProfileRepository')
    private readonly userRepo: IUserProfileRepository,
  ) {}

  async execute(user_id: number): Promise<UserProfileEntity> {
    const user = await this.userRepo.findByUserId(user_id);
    if (!user) throw new BadRequestException('User not found');
    return new UserProfileEntity(
      user.id,
      user.firstName,
      user.lastName,
      user.dateOfBirth,
      user.phoneNumber,
      user.avatarUrl,
    );
  }
}
