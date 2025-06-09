import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { IPotRepository } from 'src/domain/repositories/pot.repository';

import { PotRequest } from '../types/pot.type';
@Injectable()
export class PotTokenGuard {
  constructor(
    @Inject('PotRepository') private readonly potRepo: IPotRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<PotRequest>();
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) return false;

    const pot = await this.potRepo.findByAccessToken(token);
    if (!pot) return false;

    request.pot = pot;
    return true;
  }
}
