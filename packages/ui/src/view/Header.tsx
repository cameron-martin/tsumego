import React from 'react';
import { AppConfig } from '../config';
import { useAuth } from './auth/AuthProvider';

interface Props {
  config: AppConfig;
}

export default function Header({ config }: Props) {
  const isLoggedIn = useAuth();

  const loginUrl = `${config.cognitoWebUri}/login?response_type=code&client_id=${config.cognitoClientId}&redirect_uri=${config.uiHost}/auth/callback/login`;
  const logoutUrl = `${config.cognitoWebUri}/logout?client_id=${config.cognitoClientId}&logout_uri=${config.uiHost}/auth/callback/logout`;

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
