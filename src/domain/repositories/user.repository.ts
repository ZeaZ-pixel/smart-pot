import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  save(user: UserEntity): Promise<UserEntity>;
  deleteUnverifiedOlderThan(minutes: number): Promise<number>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  changePassword(userId: number, password: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  verifyUserEmail(email: string): Promise<UserEntity | null>;
  updateRefreshToken(userId: number, token: string): Promise<void>;
}
