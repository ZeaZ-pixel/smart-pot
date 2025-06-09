import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PotCommandEntity } from 'src/domain/entities/pot-command.entity';
import { IPotCommandsRepository } from 'src/domain/repositories/pot-command.repository';

@Injectable()
export class UsePotCommandUseCase {
  constructor(
    @Inject('PotCommandsRepository')
    private readonly potCommandsRepo: IPotCommandsRepository,
  ) {}
  async execute(potCommandId: number): Promise<PotCommandEntity> {
    const pot = await this.potCommandsRepo.useCommand(potCommandId);
    if (!pot) {
      throw new BadRequestException('Pot command not found');
    }
    return pot;
  }
}
