export interface IAuthService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
  generateAccessToken(userId: number): string;
  generateRefreshToken(userId: number): string;
  verifyRefreshToken(token: string): { sub: number };
}
