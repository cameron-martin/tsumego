import React from 'react';
import { AppConfig } from '../config';

interface Props {
  config: AppConfig;
}

export default function Header({ config }: Props) {
  const loginUrl = `${config.cognitoApiUri}/login?response_type=code&client_id=${config.cognitoClientId}&redirect_uri=${config.uiHost}/auth/callback/login`;
  const logoutUrl = `${config.cognitoApiUri}/logout?client_id=${config.cognitoClientId}&logout_uri=${config.uiHost}/auth/callback/logout`;

  return (
    <div>
      <a href={loginUrl}>Login</a> <a href={logoutUrl}>Logout</a>
    </div>
  );
}
