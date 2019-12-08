import { AuthStorage } from '.';

/**
 * Uses the web storage API (localStorage or sessionStorage)
 * to store credentials.
 */
export class WebStorage implements AuthStorage {
  constructor(private readonly storage: Storage) {}

  set(key: string, value: string): Promise<void> {
    this.storage.setItem(key, value);

    return Promise.resolve();
  }

  get(key: string): Promise<string | null> {
    return Promise.resolve(this.storage.getItem(key));
  }

  delete(key: string): Promise<void> {
    this.storage.removeItem(key);

    return Promise.resolve();
  }
}
