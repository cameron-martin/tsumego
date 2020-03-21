import React, { useState, useEffect, useContext } from 'react';
import {
  AuthContainer,
  AuthState,
  AuthContainerChangeListener,
} from '@tsumego/api-client-authentication';

interface Props {
  children: React.ReactNode;
  authContainer: AuthContainer;
}

export const AuthContext = React.createContext<AuthState | null>(null);

export function AuthProvider({ authContainer, children }: Props) {
  const [authState, setAuthState] = useState(authContainer.state);

  useEffect(() => {
    setAuthState(authContainer.state);

    const listener: AuthContainerChangeListener = (x) => setAuthState(x);
    authContainer.addChangeListener(listener);

    return () => {
      authContainer.removeChangeListener(listener);
    };
  }, [authContainer]);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
