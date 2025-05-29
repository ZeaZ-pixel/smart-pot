import { EmailCodeType } from '../types/email-code-type.enum';

export class EmailConfirmation {
  constructor(
    public readonly id: number | null,
    public code: string,
    public type: EmailCodeType,
    public isUsed: boolean,
    public attemptCount: number,
    public expiresAt: Date,
    public readonly createdAt: Date = new Date(),
  ) {}
}
