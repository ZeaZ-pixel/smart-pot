export class UserEntity {
  constructor(
    public readonly id: number | null,
    public username: string,
    public email: string,
    public password: string,
    public isVerified: boolean,
    public refreshToken?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  setRefreshToken(token: string) {
    this.refreshToken = token;
  }

  updatePassword(newPassword: string) {
    this.password = newPassword;
    this.updatedAt = new Date();
  }

  updateEmail(newEmail: string) {
    this.email = newEmail;
    this.updatedAt = new Date();
  }
}
