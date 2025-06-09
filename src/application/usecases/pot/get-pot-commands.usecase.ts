import { Inject, Injectable } from '@nestjs/common';
import { IPotCommandsRepository } from 'src/domain/repositories/pot-command.repository';
import { PotCommandEntity } from 'src/domain/entities/pot-command.entity';

@Injectable()
export class GetPotCommandsUseCase {
  constructor(
    @Inject('PotCommandsRepository')
    private readonly potCommandsRepo: IPotCommandsRepository,
  ) {}

  async execute(potId: number): Promise<PotCommandEntity[]> {
    return this.potCommandsRepo.getActiveAll(potId);
  }
}
