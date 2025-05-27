import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from '../database/models/user.model';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly repo: Repository<UserModel>,
  ) {}
  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.repo.findOne({ where: { username } });
    return user ? this.toDomain(user) : null;
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
      email: user.email,
      username: user.username,
      password: user.password,
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
      entity.refreshToken,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}
