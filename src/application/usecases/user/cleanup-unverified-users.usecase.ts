import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository';

@Injectable()
export class CleanupUnverifiedUsersUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(ttlMinutes: number = 15): Promise<number> {
    const deleted = await this.userRepo.deleteUnverifiedOlderThan(ttlMinutes);
    return deleted;
  }
}
