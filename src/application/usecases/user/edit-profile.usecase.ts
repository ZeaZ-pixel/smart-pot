import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { UserProfileEntity } from "src/domain/entities/user-profile.entity";
import { IUserProfileRepository } from "src/domain/repositories/user-profile.repository";

@Injectable()
export class EditProfileUseCase {
    constructor(
        @Inject('UserProfileRepository') private readonly userRepo: IUserProfileRepository,
    ) {}

    async execute(userId: number, profileData: UserProfileEntity) {
      const profile = await this.userRepo.findByUserId(userId);
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }
      Object.assign(profile, profileData);
      return this.userRepo.save(profile);
    }
}