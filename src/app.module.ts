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
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { AuthServiceImpl } from './application/services/auth.service.impl';
import { EmailSenderServiceImpl } from './application/services/email-sender.service.impl';
import { EmailConfirmationRepositoryImpl } from './infrastructure/repositories/email-confirmation.repository.impl';
import { ScheduleModule } from '@nestjs/schedule';
import { UserCleanupScheduler } from './interfaces/schedulers/user-cleanup.sceduler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
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
  controllers: [AuthController, UserController],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    UserCleanupScheduler,
    // Use cases
    ...authUseCases,
    ...userUseCase,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
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
