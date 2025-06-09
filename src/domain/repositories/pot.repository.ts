import { PotEntity } from '../entities/pot.entity';

export interface IPotRepository {
  save(pot: PotEntity): Promise<PotEntity>;
  findByAccessToken(token: string): Promise<PotEntity | null>;
  update(pot: PotEntity): Promise<PotEntity | null>;
  deleteById(potId: number): Promise<number | null>;
  findById(potId: number): Promise<PotEntity | null>;
  getAll(limit: number, offset: number, userId?: number): Promise<PotEntity[]>;
}
