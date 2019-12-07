import { AuthStorage } from '.';

export class MemoryStorage implements AuthStorage {
  private readonly storage = new Map<string, string>();

  set(key: string, value: string): Promise<void> {
    this.storage.set(key, value);

    return Promise.resolve();
  }

  get(key: string): Promise<string | null> {
    const value = this.storage.get(key);

    return Promise.resolve(value === undefined ? null : value);
  }
}
