import { EmailConfirmationEntity } from '../entities/email-confirmation.entity';
import { EmailCodeType } from '../types/email-code-type.enum';

export interface IEmailConfirmationRepository {
  create(
    emailConfirmation: EmailConfirmationEntity,
  ): Promise<EmailConfirmationEntity>;
  findActiveByUserIdAndType(
    userId: number,
    type: EmailCodeType,
  ): Promise<EmailConfirmationEntity | null>;
  resetCode(
    userId: number,
    type: EmailCodeType,
    code: string,
    expiresAt: Date,
  ): Promise<EmailConfirmationEntity | null>;
  findByUserIdAndType(
    userId: number,
    type: EmailCodeType,
  ): Promise<EmailConfirmationEntity | null>;
  findActiveByCode(
    userId: number,
    code: string,
    type: EmailCodeType,
  ): Promise<EmailConfirmationEntity | null>;
  incrementAttemptCount(id: number): Promise<void>;
  markAsUsed(id: number): Promise<void>;
  deleteExpired(): Promise<void>;
}
