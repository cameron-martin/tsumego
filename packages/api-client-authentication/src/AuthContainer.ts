import { AuthState } from './AuthState';

export interface AuthContainer {
  state: AuthState | null;
  addChangeListener(handler: AuthContainerChangeListener): void;
  removeChangeListener(handler: AuthContainerChangeListener): void;
}

export const nullAuthContainer: AuthContainer = {
  state: null,
  addChangeListener: () => undefined,
  removeChangeListener: () => undefined,
};

export type AuthContainerChangeListener = (state: AuthState) => void;
