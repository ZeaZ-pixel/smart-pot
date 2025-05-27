import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { IAuthService } from 'src/domain/services/auth.service';

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    @Inject('UserRepository') private readonly users: IUserRepository,
    @Inject('AuthService') private readonly auth: IAuthService,
  ) {}

  async execute(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const { sub } = this.auth.verifyRefreshToken(refreshToken);

    const user = await this.users.findById(sub);
    if (!user || !user.refreshToken) throw new ForbiddenException();

    const valid = await this.auth.compare(refreshToken, user.refreshToken);
    if (!valid) throw new ForbiddenException('Token revoked');

    const newAccess = this.auth.generateAccessToken(sub);

    return { accessToken: newAccess, refreshToken };
  }
}
