import { Inject } from "@nestjs/common";
import { PotCommandEntity } from "../../domain/entities/pot-command.entity";
import { IPotCommandsRepository } from "src/domain/repositories/pot-command.repository";
import { PotCommandModel } from "../database/models/pot-command.model";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class PotCommandRepositoryImpl implements IPotCommandsRepository {
    constructor(
        @InjectRepository(PotCommandModel)
        private readonly repo: Repository<PotCommandModel>,
    ) {}

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
            model.payload,
            model.isUsed,
            model.executedAt,
            model.createdAt,
            model.updatedAt,
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