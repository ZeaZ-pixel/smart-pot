import { PotEntity } from '../entities/pot.entity';

export interface IPotRepository {
  save(pot: PotEntity): Promise<PotEntity>;
  delete(pot_id: number): Promise<void | null>;
  edit(pot: PotEntity): Promise<PotEntity>;
}
