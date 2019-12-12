import { AuthStorage } from '.';

/**
 * Uses the web storage API (localStorage or sessionStorage)
 * to store credentials.
 */
export class WebAuthStorage implements AuthStorage {
  constructor(private readonly storage: Storage) {}

  setAccessToken(value: string): Promise<void> {
    this.storage.setItem('accessToken', value);

    return Promise.resolve();
  }

  getAccessToken(): Promise<string | null> {
    return Promise.resolve(this.storage.getItem('accessToken'));
  }

  deleteAccessToken(): Promise<void> {
    this.storage.removeItem('accessToken');

    return Promise.resolve();
  }

  setRefreshToken(value: string): Promise<void> {
    this.storage.setItem('refreshToken', value);

    return Promise.resolve();
  }

  getRefreshToken(): Promise<string | null> {
    return Promise.resolve(this.storage.getItem('refreshToken'));
  }

  deleteRefreshToken(): Promise<void> {
    this.storage.removeItem('refreshToken');

    return Promise.resolve();
  }
}
