import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import models from './infrastructure/database/models';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './interfaces/controllers/auth.controller';
import { UserController } from './interfaces/controllers/user.controller';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from './interfaces/common/guards/jwt-auth.guard';
import authUseCases from './application/usecases/auth';
import userUseCase from './application/usecases/user';
import potUseCases from './application/usecases/pot';

import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { AuthServiceImpl } from './application/services/auth.service.impl';
import { EmailSenderServiceImpl } from './application/services/email-sender.service.impl';
import { EmailConfirmationRepositoryImpl } from './infrastructure/repositories/email-confirmation.repository.impl';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCleanupScheduler } from './interfaces/schedulers/user-cleanup.sceduler';
import { UserProfileRepositoryImpl } from './infrastructure/repositories/user-profile.repository.impl';
import { PotRepositoryImpl } from './infrastructure/repositories/pot.repository.impl';
import { PotController } from './interfaces/controllers/pot.controller';
import { PotPrivateController } from './interfaces/controllers/pot.private.controller';
import { PotCommandRepositoryImpl } from './infrastructure/repositories/pot-command.repository.impl';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          emailCodeConfig: {
            code: {
              expiresInSeconds: parseInt(
                process.env.EMAIL_CODE_EXPIRES_IN_SECONDS || '600',
              ),
              maxAttempts: parseInt(process.env.EMAIL_CODE_MAX_ATTEMPTS || '5'),
            },
          },
        }),
      ],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
      database: process.env.POSTGRES_DB || 'db',
      entities: [...models],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([...models]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.ACCESS_SECRET,
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    PotController,
    PotPrivateController,
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    UserCleanupScheduler,
    // Use cases
    ...authUseCases,
    ...userUseCase,
    ...potUseCases,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'PotRepository',
      useClass: PotRepositoryImpl,
    },
    {
      provide: 'PotCommandsRepository',
      useClass: PotCommandRepositoryImpl,
    },
    {
      provide: 'UserProfileRepository',
      useClass: UserProfileRepositoryImpl,
    },
    {
      provide: 'EmailConfirmationRepository',
      useClass: EmailConfirmationRepositoryImpl,
    },
    {
      provide: 'EmailSenderService',
      useClass: EmailSenderServiceImpl,
    },
    {
      provide: 'AuthService',
      useClass: AuthServiceImpl,
    },
  ],
})
export class AppModule {}
