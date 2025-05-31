import { PotEntity } from '../entities/pot.entity';

export interface IPotRepository {
  save(pot: PotEntity): Promise<PotEntity>;
  deleteById(potId: number): Promise<number | null>;
  findById(potId: number): Promise<PotEntity | null>;
  getAll(limit: number, offset: number): Promise<PotEntity[]>;
}
