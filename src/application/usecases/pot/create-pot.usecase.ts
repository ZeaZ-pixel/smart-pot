import { Inject, Injectable } from '@nestjs/common';
import { PotEntity } from 'src/domain/entities/pot.entity';
import { IPotRepository } from 'src/domain/repositories/pot.repository';

@Injectable()
export class CreatePotUseCase {
  constructor(
    @Inject('PotRepository') private readonly potRepo: IPotRepository,
  ) {}

  async execute(potData: PotEntity): Promise<PotEntity> {
    const pot = await this.potRepo.save(potData);
    return pot;
  }
}
