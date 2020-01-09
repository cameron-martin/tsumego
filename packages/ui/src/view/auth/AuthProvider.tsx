import React, { useState, useEffect, useContext } from 'react';
import {
  AuthState,
  AuthStateChangeListener,
} from '@tsumego/api-client-authentication';

interface Props {
  children: React.ReactNode;
  authState: AuthState;
}

// false means uninitialised
export const AuthContext = React.createContext<string | null | false>(false);

export function AuthProvider({ authState, children }: Props) {
  const [userId, setUserId] = useState(authState.userId);

  useEffect(() => {
    const listener: AuthStateChangeListener = x => setUserId(x);

    authState.addChangeListener(listener);

    return () => {
      authState.removeChangeListener(listener);
    };
  }, [authState]);

  return <AuthContext.Provider value={userId}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const userId = useContext(AuthContext);

  if (userId === false) {
    throw new Error('You must wrap your app in an AuthProvider');
  }

  return userId;
}
