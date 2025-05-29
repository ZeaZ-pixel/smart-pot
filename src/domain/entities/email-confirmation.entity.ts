import { EmailCodeType } from '../types/email-code-type.enum';

export class EmailConfirmationEntity {
  constructor(
    public readonly id: number | null,
    public code: string,
    public type: EmailCodeType,
    public expiresAt: Date,
    public userId: number,
    public isUsed: boolean,
    public attemptCount: number,
    public readonly createdAt: Date = new Date(),
  ) {}
}
