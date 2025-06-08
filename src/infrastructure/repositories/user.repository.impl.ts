import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { UserModel } from '../database/models/user.model';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly repo: Repository<UserModel>,
  ) {}

  async changePassword(
    userId: number,
    password: string,
  ): Promise<UserEntity | null> {
    await this.repo.update(userId, {
      password,
      updatedAt: new Date(),
    });
    const updatedUser = await this.repo.findOne({ where: { id: userId } });

    return updatedUser ? this.toDomain(updatedUser) : null;
  }

  async deleteUnverifiedOlderThan(minutes: number): Promise<number> {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);

    const result = await this.repo.delete({
      isVerified: false,
      createdAt: LessThan(cutoff),
    });

    return result.affected ?? 0;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.repo.findOne({ where: { username } });
    return user ? this.toDomain(user) : null;
  }

  async verifyUserEmail(email: string): Promise<UserEntity | null> {
    await this.repo.update(
      { email },
      {
        isVerified: true,
        updatedAt: new Date(),
      },
    );
    const updatedUser = await this.repo.findOne({ where: { email } });

    return updatedUser ? this.toDomain(updatedUser) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repo.findOne({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.repo.findOne({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async save(user: UserEntity): Promise<UserEntity> {
    const ormUser = this.repo.create({
      id: user?.id ?? undefined,
      email: user.email,
      username: user.username,
      password: user.password,
      isVerified: user.isVerified,
      refreshToken: user.refreshToken,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    await this.repo.save(ormUser);
    return this.toDomain(ormUser);
  }

  async updateRefreshToken(userId: number, token: string): Promise<void> {
    await this.repo.update(userId, {
      refreshToken: token,
      updatedAt: new Date(),
    });
  }

  private toDomain(entity: UserModel): UserEntity {
    return new UserEntity(
      entity.id,
      entity.username,
      entity.email,
      entity.password,
      entity.isVerified,
      entity.refreshToken,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
