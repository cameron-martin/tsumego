import { AuthStorage } from '.';

export class MemoryAuthStorage implements AuthStorage {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setAccessToken(value: string): Promise<void> {
    this.accessToken = value;

    return Promise.resolve();
  }

  getAccessToken(): Promise<string | null> {
    return Promise.resolve(this.accessToken);
  }

  deleteAccessToken(): Promise<void> {
    this.accessToken = null;

    return Promise.resolve();
  }

  setRefreshToken(value: string): Promise<void> {
    this.refreshToken = value;

    return Promise.resolve();
  }

  getRefreshToken(): Promise<string | null> {
    return Promise.resolve(this.refreshToken);
  }

  deleteRefreshToken(): Promise<void> {
    this.refreshToken = null;

    return Promise.resolve();
  }
}
