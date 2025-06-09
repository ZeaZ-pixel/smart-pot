import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PotEntity } from 'src/domain/entities/pot.entity';
import { IPotRepository } from 'src/domain/repositories/pot.repository';

@Injectable()
export class DeletePotUseCase {
  constructor(
    @Inject('PotRepository') private readonly potRepo: IPotRepository,
  ) {}

  async execute(userId: number, potId: number): Promise<PotEntity | null> {
    const pot = await this.potRepo.findById(potId);
    if (!pot || pot.userId !== userId) {
      throw new BadRequestException('Pot not found');
    }
    const unassignedPot = await this.potRepo.unassignUser(potId);
    if (!unassignedPot) {
      throw new BadRequestException('Failed to unassign pot');
    }
    return unassignedPot;
  }
}
