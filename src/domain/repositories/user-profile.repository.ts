import { UserProfileEntity } from '../entities/user-profile.entity';

export interface IUserProfileRepository {
  save(userProfile: UserProfileEntity): Promise<UserProfileEntity>;
  findByUserId(userId: number): Promise<UserProfileEntity>;
}
