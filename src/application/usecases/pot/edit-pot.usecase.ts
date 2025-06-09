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
    imageBase64: string,
  ): Promise<PotEntity> {
    const pot = await this.potRepo.findById(potId);
    if (!pot || pot.userId !== userId) {
      throw new BadRequestException('Pot not found');
    }
    const updatedPot = await this.potRepo.setImage(potId, imageBase64);
    if (!updatedPot) {
      throw new BadRequestException('Failed to update pot image');
    }
    return updatedPot;
  }
}
