export class UserProfile {
  constructor(
    public readonly id: number | null,
    public firstName: string,
    public lastName: string,
    public dateOfBirth: Date,
    public phoneNumber: string,
    public avatarUrl: string,
  ) {}
}
