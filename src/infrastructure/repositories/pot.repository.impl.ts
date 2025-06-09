import { PotEntity } from 'src/domain/entities/pot.entity';
import { IPotRepository } from 'src/domain/repositories/pot.repository';
import { PotModel } from '../database/models/pot.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class PotRepositoryImpl implements IPotRepository {
  constructor(
    @InjectRepository(PotModel)
    private readonly repo: Repository<PotModel>,
  ) {}
  async findByUserId(userId: number): Promise<PotEntity | null> {
    const pot = await this.repo.findOne({
      where: { userId },
    });
    return pot ? this.toDomain(pot) : null;
  }
  async setImage(
    potId: number,
    imageBase64: string,
  ): Promise<PotEntity | null> {
    const pot = await this.repo.findOne({
      where: { id: potId },
    });
    if (!pot) {
      return null;
    }
    pot.imageBase64 = imageBase64;
    await this.repo.save(pot);
    return this.toDomain(pot);
  }
  async unassignUser(potId: number): Promise<PotEntity | null> {
    const pot = await this.repo.findOne({
      where: { id: potId },
    });
    if (!pot) {
      return null;
    }
    pot.userId = null;
    await this.repo.save(pot);
    return this.toDomain(pot);
  }
  async findByName(name: string): Promise<PotEntity | null> {
    const pot = await this.repo.findOne({
      where: { name },
    });
    return pot ? this.toDomain(pot) : null;
  }
  async assignUser(potId: number, userId: number): Promise<PotEntity | null> {
    const pot = await this.repo.findOne({
      where: { id: potId },
    });
    if (!pot) {
      return null;
    }
    pot.userId = userId;
    await this.repo.save(pot);
    return this.toDomain(pot);
  }
  async update(pot: PotEntity): Promise<PotEntity | null> {
    const potData = this.repo.create(this.toPersistence(pot));
    await this.repo.save(potData);
    return this.toDomain(potData);
  }

  async findByAccessToken(token: string): Promise<PotEntity | null> {
    const pot = await this.repo.findOne({
      where: { accessToken: token },
    });

    return pot ? this.toDomain(pot) : null;
  }

  async save(pot: PotEntity): Promise<PotEntity> {
    const ormPot = this.repo.create(this.toPersistence(pot));
    await this.repo.save(ormPot);
    return this.toDomain(ormPot);
  }

  async deleteById(potId: number): Promise<number | null> {
    const result = await this.repo.delete({
      id: potId,
    });

    return result.affected ?? null;
  }

  async findById(potId: number): Promise<PotEntity | null> {
    const pot = await this.repo.findOneBy({ id: potId });
    return pot ? this.toDomain(pot) : null;
  }
  async getAll(
    limit: number,
    offset: number,
    userId?: number,
  ): Promise<PotEntity[]> {
    const pots = await this.repo.find({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
      where: {
        userId,
      },
    });

    return pots.map((pot) => this.toDomain(pot));
  }

  private toDomain(model: PotModel): PotEntity {
    return new PotEntity(
      model.id,
      model.userId,
      model.name,
      model.password,
      model.temperature,
      model.humidity,
      model.soilMoisture,
      model.photoresistor,
      model.waterSensor,
      model.vitaminSensor,
      model.PHValue,
      model.timestamp,
      model.createdAt,
      model.updatedAt,
    );
  }

  private toPersistence(entity: PotEntity): Partial<PotModel> {
    return {
      id: entity.id!,
      userId: entity.userId ?? undefined,
      name: entity.name,
      temperature: entity.temperature,
      humidity: entity.humidity,
      soilMoisture: entity.soilMoisture,
      photoresistor: entity.photoresistor,
      waterSensor: entity.waterSensor,
      vitaminSensor: entity.vitaminSensor,
      PHValue: entity.PHValue,
      timestamp: entity.timestamp,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
