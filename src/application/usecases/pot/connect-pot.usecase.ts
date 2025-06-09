import { Inject, Injectable } from '@nestjs/common';
import { IPotRepository } from 'src/domain/repositories/pot.repository';
import { PotEntity } from 'src/domain/entities/pot.entity';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ConnectPotUseCase {
  constructor(
    @Inject('PotRepository') private readonly potRepo: IPotRepository,
  ) {}

  async execute(
    potName: string,
    potPassword: string,
    userId: number,
  ): Promise<PotEntity> {
    const pot = await this.potRepo.findByName(potName);
    if (!pot) {
      throw new BadRequestException('Pot not found');
    }
    if (pot.password !== potPassword) {
      throw new BadRequestException('Invalid password');
    }

    const assignedPot = await this.potRepo.assignUser(pot.id!, userId);
    if (!assignedPot) {
      throw new BadRequestException('Failed to assign pot');
    }

    return assignedPot;
  }
}
