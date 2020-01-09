import { AuthStorage } from '.';
import { AuthState, AuthStateChangeListener } from '../AuthState';
import jwtDecode from 'jwt-decode';

interface Token {
  sub: string;
}

export class AuthStorageProxy implements AuthStorage, AuthState {
  public userId: string | null = null;
  private listeners: Set<AuthStateChangeListener> = new Set();

  static async create(storage: AuthStorage) {
    const token = await storage.getAccessToken();

    return new AuthStorageProxy(
      storage,
      token ? jwtDecode<Token>(token).sub : null,
    );
  }

  constructor(private readonly storage: AuthStorage, userId: string | null) {
    this.userId = userId;
  }

  setAccessToken(value: string): Promise<void> {
    this.setUser(jwtDecode<Token>(value).sub);
    return this.storage.setAccessToken(value);
  }

  getAccessToken(): Promise<string | null> {
    return this.storage.getAccessToken();
  }

  deleteAccessToken(): Promise<void> {
    this.setUser(null);
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

  private setUser(userId: string | null) {
    this.userId = userId;

    this.listeners.forEach(handler => {
      handler(userId);
    });
  }
}
