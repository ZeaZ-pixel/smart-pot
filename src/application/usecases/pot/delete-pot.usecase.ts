import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IPotRepository } from 'src/domain/repositories/pot.repository';

@Injectable()
export class DeletePotUseCase {
  constructor(
    @Inject('PotRepository') private readonly potRepo: IPotRepository,
  ) {}

  async execute(userId: number, potId: number): Promise<number | null> {
    const pot = await this.potRepo.findById(potId);
    if (!pot || pot.userId !== userId) {
      throw new BadRequestException('Pot not found');
    }
    return await this.potRepo.deleteById(potId);
  }
}
