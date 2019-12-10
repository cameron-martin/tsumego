import { AuthStorage } from '.';
import { AuthState, AuthStateChangeListener } from '../AuthState';

export class AuthStorageProxy implements AuthStorage, AuthState {
  public isLoggedIn: boolean;
  private listeners: Set<AuthStateChangeListener> = new Set();

  static async create(storage: AuthStorage) {
    return new AuthStorageProxy(
      storage,
      (await storage.getAccessToken()) != null,
    );
  }

  constructor(
    private readonly storage: AuthStorage,
    initiallyLoggedIn: boolean,
  ) {
    this.isLoggedIn = initiallyLoggedIn;
  }

  setAccessToken(value: string): Promise<void> {
    this.setLoggedIn(true);
    return this.storage.setAccessToken(value);
  }

  getAccessToken(): Promise<string | null> {
    return this.storage.getAccessToken();
  }

  deleteAccessToken(): Promise<void> {
    this.setLoggedIn(false);
    return this.storage.deleteAccessToken();
  }

  setRefreshToken(value: string): Promise<void> {
    return this.storage.setRefreshToken(value);
  }

  getRefreshToken(): Promise<string | null> {
    return this.storage.getRefreshToken();
  }

  deleteRefreshToken(): Promise<void> {
    return this.storage.deleteRefreshToken();
  }

  addChangeListener(listener: AuthStateChangeListener): void {
    this.listeners.add(listener);
  }

  removeChangeListener(listener: AuthStateChangeListener): void {
    this.listeners.delete(listener);
  }

  private setLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;

    this.listeners.forEach(handler => {
      handler(isLoggedIn);
    });
  }
}
