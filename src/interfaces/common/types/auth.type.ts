import { Request } from 'express';
import { UserEntity } from 'src/domain/entities/user.entity';

export interface AuthenticatedRequest extends Request {
  user: UserEntity;
}

export interface TokenRequest extends Request {
  accessToken: string;
  refreshToken: string;
}
