export interface AuthState {
  userId: string | null;
  addChangeListener(handler: AuthStateChangeListener): void;
  removeChangeListener(handler: AuthStateChangeListener): void;
}

export type AuthStateChangeListener = (userId: string | null) => void;
