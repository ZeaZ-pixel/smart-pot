export class PotCommandEntity {
  constructor(
    public readonly id: number | null,
    public potId: number,
    public type: string,
    public payload: any,
    public isUsed: boolean,
    public executedAt: Date,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}
}
