import React from 'react';
import { AppConfig } from '../config';
import { useAuthState } from './auth/useAuthState';
import { AuthState } from '../api-client/authentication/AuthState';

interface Props {
  config: AppConfig;
  authState: AuthState;
}

export default function Header({ config, authState }: Props) {
  const isLoggedIn = useAuthState(authState);

  const loginUrl = `${config.cognitoApiUri}/login?response_type=code&client_id=${config.cognitoClientId}&redirect_uri=${config.uiHost}/auth/callback/login`;
  const logoutUrl = `${config.cognitoApiUri}/logout?client_id=${config.cognitoClientId}&logout_uri=${config.uiHost}/auth/callback/logout`;

  return (
    <div>
      {isLoggedIn ? (
        <a href={logoutUrl}>Logout</a>
      ) : (
        <a href={loginUrl}>Login</a>
      )}
    </div>
  );
}
