import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProfileEntity } from 'src/domain/entities/user-profile.entity';
import { IUserProfileRepository } from 'src/domain/repositories/user-profile.repository';
import { UserProfileModel } from '../database/models/user-profile.model';
import { Repository } from 'typeorm';

@Injectable()
export class UserProfileRepositoryImpl implements IUserProfileRepository {
  constructor(
    @InjectRepository(UserProfileModel)
    private readonly repo: Repository<UserProfileModel>,
  ) {}
  async save(userProfile: UserProfileEntity): Promise<UserProfileEntity> {
    const profile = this.repo.create(this.toPersistence(userProfile));
    await this.repo.save(profile);
    return this.toDomain(profile);
  }

  async findByUserId(userId: number): Promise<UserProfileEntity | null> {
    const profile = await this.repo.findOneBy({ user: { id: userId } });
    return profile ? this.toDomain(profile) : null;
  }

  private toDomain(model: UserProfileModel): UserProfileEntity {
    return new UserProfileEntity(
      model.id,
      model.firstName,
      model.lastName,
      model.dateOfBirth,
      model.phoneNumber,
      model.avatarUrl,
    );
  }

  private toPersistence(entity: UserProfileEntity): Partial<UserProfileModel> {
    return {
      id: entity.id!,
      phoneNumber: entity.phoneNumber,
      firstName: entity.firstName,
      lastName: entity.lastName,
      dateOfBirth: entity.dateOfBirth,
      avatarUrl: entity.avatarUrl,
    };
  }
}
