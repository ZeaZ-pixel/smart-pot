import { Inject, Injectable } from '@nestjs/common';
import { IPotRepository } from 'src/domain/repositories/pot.repository';
import { PotEntity } from 'src/domain/entities/pot.entity';

@Injectable()
export class GetUserPotsUseCase {
  constructor(
    @Inject('PotRepository') private readonly potRepo: IPotRepository,
  ) {}

  async execute(userId: number): Promise<PotEntity[]> {
    const pots = await this.potRepo.getAll(100, 0, userId);
    return pots;
  }
}
