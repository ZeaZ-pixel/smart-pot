// src/infrastructure/schedulers/user-cleanup.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CleanupUnverifiedUsersUseCase } from 'src/application/usecases/user';

@Injectable()
export class UserCleanupScheduler {
  private readonly logger = new Logger(UserCleanupScheduler.name);

  constructor(private readonly cleanupUseCase: CleanupUnverifiedUsersUseCase) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCleanup(): Promise<void> {
    const deleted = await this.cleanupUseCase.execute(15);
    if (deleted > 0) {
      this.logger.log(`🧹 Deleted ${deleted} unverified users`);
    }
  }
}
