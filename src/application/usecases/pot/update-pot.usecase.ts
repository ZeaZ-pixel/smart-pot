import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PotEntity } from 'src/domain/entities/pot.entity';
import { IPotRepository } from 'src/domain/repositories/pot.repository';

@Injectable()
export class UpdatePotUseCase {
  constructor(
    @Inject('PotRepository') private readonly potRepo: IPotRepository,
  ) {}

  async execute(potId: number, potData: PotEntity): Promise<PotEntity> {
    const pot = await this.potRepo.findById(potId);
    if (!pot) {
      throw new BadRequestException('Pot not found');
    }
    Object.assign(pot, potData);
    const data = await this.potRepo.update(pot);
    if (!data) {
      throw new BadRequestException('Update error');
    }
    return pot;
  }
}
