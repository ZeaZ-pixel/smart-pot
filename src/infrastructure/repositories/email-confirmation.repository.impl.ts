import { InjectRepository } from '@nestjs/typeorm';
import { EmailConfirmationEntity } from 'src/domain/entities/email-confirmation.entity';
import { IEmailConfirmationRepository } from 'src/domain/repositories/email-confirmation.repository';
import { EmailCodeType } from 'src/domain/types/email-code-type.enum';
import { EmailConfirmationModel } from '../database/models/email-confirmations.model';
import { MoreThan, Repository } from 'typeorm';

export class EmailConfirmationRepositoryImpl
  implements IEmailConfirmationRepository
{
  constructor(
    @InjectRepository(EmailConfirmationModel)
    private readonly repo: Repository<EmailConfirmationModel>,
  ) {}

  async create(
    entity: EmailConfirmationEntity,
  ): Promise<EmailConfirmationEntity> {
    const model = this.repo.create(this.toPersistence(entity));

    const result = await this.repo.save(model);
    return this.toDomain(result);
  }

  async resetCode(
    userId: number,
    type: EmailCodeType,
    code: string,
    expiresAt: Date,
  ): Promise<EmailConfirmationEntity | null> {
    const existing = await this.repo.findOne({
      where: {
        userId: userId,
        type: type,
      },
    });
    if (!existing) {
      return null;
    }

    existing.code = code;
    existing.expiresAt = expiresAt;

    const result = await this.repo.save(existing);
    return result;
  }

  async findByUserIdAndType(
    userId: number,
    type: EmailCodeType,
  ): Promise<EmailConfirmationEntity | null> {
    const model = await this.repo.findOne({
      where: {
        userId,
        type,
      },
    });
    return model ? this.toDomain(model) : null;
  }

  async findActiveByUserIdAndType(
    userId: number,
    type: EmailCodeType,
  ): Promise<EmailConfirmationEntity | null> {
    const model = await this.repo.findOne({
      where: {
        userId,
        type,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });
    return model ? this.toDomain(model) : null;
  }

  async findActiveByCode(
    userId: number,
    code: string,
    type: EmailCodeType,
  ): Promise<EmailConfirmationEntity | null> {
    const model = await this.repo.findOne({
      where: {
        userId,
        code,
        type,
        isUsed: false,
        expiresAt: MoreThan(new Date()),
      },
    });
    return model ? this.toDomain(model) : null;
  }

  async incrementAttemptCount(id: number): Promise<void> {
    await this.repo.increment({ id }, 'attemptCount', 1);
  }

  async markAsUsed(id: number): Promise<void> {
    await this.repo.update(id, { isUsed: true });
  }

  async deleteExpired(): Promise<void> {
    await this.repo.delete({
      expiresAt: MoreThan(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)),
    });
  }

  private toDomain(model: EmailConfirmationModel): EmailConfirmationEntity {
    return new EmailConfirmationEntity(
      model.id,
      model.code,
      model.type,
      model.expiresAt,
      model.userId,
      model.isUsed,
      model.attemptCount,
      model.createdAt,
    );
  }

  private toPersistence(
    entity: EmailConfirmationEntity,
  ): Partial<EmailConfirmationModel> {
    return {
      id: entity.id ?? undefined,
      code: entity.code,
      type: entity.type,
      expiresAt: entity.expiresAt,
      isUsed: entity.isUsed,
      attemptCount: entity.attemptCount,
      createdAt: entity.createdAt,
      userId: entity.userId,
    };
  }
}
