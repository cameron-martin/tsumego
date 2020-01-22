import jwtDecode from 'jwt-decode';
import { AuthContainer, AuthContainerChangeListener } from '../AuthContainer';
import { AuthState } from '../AuthState';
import { AuthStorage } from '.';

interface Token {
  sub: string;
}

export class AuthStorageProxy implements AuthStorage, AuthContainer {
  private listeners: Set<AuthContainerChangeListener> = new Set();
  private hasLoaded = false;

  constructor(
    private readonly storage: AuthStorage,
    public state: AuthState | null = null,
  ) {}

  public async load() {
    const token = await this.getAccessToken();

    if (this.hasLoaded) return;

    if (token) {
      this.setState({ userId: jwtDecode<Token>(token).sub });
    } else {
      this.setState({ userId: null });
    }
  }

  setAccessToken(value: string): Promise<void> {
    this.setState({ userId: jwtDecode<Token>(value).sub });
    return this.storage.setAccessToken(value);
  }

  getAccessToken(): Promise<string | null> {
    return this.storage.getAccessToken();
  }

  deleteAccessToken(): Promise<void> {
    this.setState({ userId: null });
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

  addChangeListener(listener: AuthContainerChangeListener): void {
    this.listeners.add(listener);
  }

  removeChangeListener(listener: AuthContainerChangeListener): void {
    this.listeners.delete(listener);
  }

  private setState(state: AuthState) {
    this.hasLoaded = true;
    this.state = state;

    this.listeners.forEach(handler => {
      handler(state);
    });
  }
}
