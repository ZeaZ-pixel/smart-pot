import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IPotRepository } from 'src/domain/repositories/pot.repository';
import { PotEntity } from 'src/domain/entities/pot.entity';

@Injectable()
export class EditPotUseCase {
  constructor(
    @Inject('PotRepository') private readonly potRepo: IPotRepository,
  ) {}

  async execute(
    userId: number,
    potId: number,
    potData: PotEntity,
  ): Promise<PotEntity> {
    const pot = await this.potRepo.findById(potId);
    if (!pot || pot.userId !== userId) {
      throw new BadRequestException('Pot not found');
    }
    Object.assign(pot, potData);
    return await this.potRepo.save(pot);
  }
}
