import { PotCommandEntity } from '../../domain/entities/pot-command.entity';
import { IPotCommandsRepository } from 'src/domain/repositories/pot-command.repository';
import { PotCommandModel } from '../database/models/pot-command.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class PotCommandRepositoryImpl implements IPotCommandsRepository {
  constructor(
    @InjectRepository(PotCommandModel)
    private readonly repo: Repository<PotCommandModel>,
  ) {}
  async createCommand(
    potId: number,
    type: string,
    payload: object,
  ): Promise<PotCommandEntity> {
    const model = this.repo.create({
      potId,
      type,
      payload,
      isUsed: false,
      executedAt: new Date(),
    });
    const result = await this.repo.save(model);
    return this.toDomain(result);
  }
  async useCommand(potCommandId: number): Promise<PotCommandEntity | null> {
    const model = await this.repo.findOneBy({ id: potCommandId });
    if (!model) {
      return null;
    }
    model.isUsed = true;
    model.executedAt = new Date();
    return this.repo.save(model);
  }

  async getActiveAll(potId: number): Promise<PotCommandEntity[]> {
    const models = await this.repo.find({ where: { potId, isUsed: false } });
    return models.map((model) => this.toDomain(model));
  }

  async save(potCommand: PotCommandEntity): Promise<PotCommandEntity> {
    const model = this.repo.create(this.toPersistence(potCommand));
    const result = await this.repo.save(model);
    return this.toDomain(result);
  }

  private toDomain(model: PotCommandModel): PotCommandEntity {
    return new PotCommandEntity(
      model.id,
      model.potId,
      model.type,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      model.payload,
      model.isUsed,
      model.executedAt,
    );
  }

  private toPersistence(entity: PotCommandEntity): Partial<PotCommandModel> {
    return {
      id: entity.id!,
      potId: entity.potId,
      type: entity.type,
      payload: entity.payload,
      isUsed: entity.isUsed,
      executedAt: entity.executedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
