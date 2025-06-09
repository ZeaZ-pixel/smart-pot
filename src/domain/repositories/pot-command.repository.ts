import { PotCommandEntity } from '../entities/pot-command.entity';

export interface IPotCommandsRepository {
  getActiveAll(potId: number): Promise<PotCommandEntity[]>;
  save(potCommand: PotCommandEntity): Promise<PotCommandEntity>;
  createCommand(
    potId: number,
    type: string,
    payload: any,
  ): Promise<PotCommandEntity>;
  useCommand(potCommandId: number): Promise<PotCommandEntity | null>;
}
