import { useState, useEffect } from 'react';
import {
  AuthState,
  AuthStateChangeListener,
} from '../../api-client/authentication/AuthState';

export function useAuthState(authState: AuthState) {
  const [isLoggedIn, setIsLoggedIn] = useState(authState.isLoggedIn);

  useEffect(() => {
    const listener: AuthStateChangeListener = x => setIsLoggedIn(x);

    authState.addChangeListener(listener);

    return () => {
      authState.removeChangeListener(listener);
    };
  });

  return isLoggedIn;
}
