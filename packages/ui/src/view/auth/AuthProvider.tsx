import React, { useState, useEffect, useContext } from 'react';
import {
  AuthState,
  AuthStateChangeListener,
} from '@tsumego/api-client-authentication';

interface Props {
  children: React.ReactNode;
  authState: AuthState;
}

export const AuthContext = React.createContext<boolean | null>(null);

export function AuthProvider({ authState, children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(authState.isLoggedIn);

  useEffect(() => {
    const listener: AuthStateChangeListener = x => setIsLoggedIn(x);

    authState.addChangeListener(listener);

    return () => {
      authState.removeChangeListener(listener);
    };
  });

  return (
    <AuthContext.Provider value={isLoggedIn}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const isLoggedIn = useContext(AuthContext);

  if (isLoggedIn === null) {
    throw new Error('You must wrap your app in an AuthProvider');
  }

  return isLoggedIn;
}
