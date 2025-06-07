import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { GetMeUseCase, EditProfileUseCase } from 'src/application/usecases/user';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/auth.type';
import { UserProfileEntity } from 'src/domain/entities/user-profile.entity';
import { EditProfileDto } from '../dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly getMeUseCase: GetMeUseCase, private readonly editProfileUseCase: EditProfileUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: AuthenticatedRequest): Promise<UserProfileEntity> {
    return this.getMeUseCase.execute(req.user.id!);
  }

  @UseGuards(JwtAuthGuard)
  @Post('edit')
  async editProfile(@Request() req: AuthenticatedRequest,  @Body() dto: EditProfileDto): Promise<UserProfileEntity> {
    return this.editProfileUseCase.execute(req.user.id!, new UserProfileEntity(null, dto.firstName, dto.lastName, dto.dateOfBirth, dto.phoneNumber, dto.avatarUrl));
  }
}
