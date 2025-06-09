import { Injectable } from '@nestjs/common';
import { IPotCommandsRepository } from 'src/domain/repositories/pot-command.repository';
import { PotCommandEntity } from 'src/domain/entities/pot-command.entity';
import { Inject } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { IPotRepository } from 'src/domain/repositories/pot.repository';

@Injectable()
export class CreatePotCommandUseCase {
  constructor(
    @Inject('PotCommandsRepository')
    private readonly potCommandRepo: IPotCommandsRepository,
    @Inject('PotRepository') private readonly potRepo: IPotRepository,
  ) {}
  async execute(
    userId: number,
    potId: number,
    type: string,
    payload: any,
  ): Promise<PotCommandEntity> {
    const pot = await this.potRepo.findByUserId(userId);
    if (!pot) {
      throw new BadRequestException('Pot not found');
    }
    return this.potCommandRepo.createCommand(potId, type, payload);
  }
}
