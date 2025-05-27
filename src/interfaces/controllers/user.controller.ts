import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GetMeUseCase } from 'src/application/usecases/user/get-me.usecase';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/auth.type';
import { UserProfile } from 'src/domain/entities/user-profile.entity';

@Controller('users')
export class UserController {
  constructor(private readonly getMeUseCase: GetMeUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: AuthenticatedRequest): Promise<UserProfile> {
    return this.getMeUseCase.execute(req.user.id!);
  }
}
