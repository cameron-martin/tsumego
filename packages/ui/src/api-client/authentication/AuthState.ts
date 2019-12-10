export interface AuthState {
  isLoggedIn: boolean;
  addChangeListener(handler: AuthStateChangeListener): void;
  removeChangeListener(handler: AuthStateChangeListener): void;
}

export type AuthStateChangeListener = (isLoggedIn: boolean) => void;
