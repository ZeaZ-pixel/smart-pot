import * as bcrypt from 'bcrypt';
import { IAuthService } from '../../domain/services/auth.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthServiceImpl implements IAuthService {
  constructor(private readonly jwt: JwtService) {}

  generateAccessToken(userId: number): string {
    return this.jwt.sign(
      { sub: userId },
      { expiresIn: '2d', secret: process.env.ACCESS_SECRET },
    );
  }

  generateRefreshToken(userId: number): string {
    return this.jwt.sign(
      { sub: userId },
      { expiresIn: '7d', secret: process.env.REFRESH_SECRET },
    );
  }

  verifyRefreshToken(token: string) {
    return this.jwt.verify<{ sub: number }>(token, {
      secret: process.env.REFRESH_SECRET,
    });
  }

  async hash(v: string): Promise<string> {
    return bcrypt.hash(v, 10);
  }

  async compare(v: string, hash: string): Promise<boolean> {
    return bcrypt.compare(v, hash);
  }
}
