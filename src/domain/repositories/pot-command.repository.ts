import { PotCommandEntity } from '../entities/pot-command.entity';

export interface IPotCommandsRepository {
  getActiveAll(potId: number): Promise<PotCommandEntity[]>;
  save(potCommand: PotCommandEntity): Promise<PotCommandEntity>;
  useCommand(potCommandId: number): Promise<PotCommandEntity | null>;
}
