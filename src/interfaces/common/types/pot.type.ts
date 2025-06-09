import { PotEntity } from 'src/domain/entities/pot.entity';
import { Request } from 'express';

export interface PotRequest extends Request {
  pot: PotEntity;
}
