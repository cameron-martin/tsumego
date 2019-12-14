import React from 'react';
import { Router } from '@reach/router';
import { ApiClient } from '@tsumego/api-client';
import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import { AppConfig } from '../config';
import Header from './Header';
import RouterPage from './RouterPage';
import LoginCallback from './auth/LoginCallback';
import LogoutCallback from './auth/LogoutCallback';
import Homepage from './Homepage';

interface Props {
  apiClient: ApiClient;
  config: AppConfig;
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager;
}

export default function App({ apiClient, config, tokenManager }: Props) {
  return (
    <div>
      <Header config={config} />
      <Router>
        <RouterPage
          path="auth/callback/login"
          element={<LoginCallback tokenManager={tokenManager} />}
        />
        <RouterPage
          path="auth/callback/logout"
          element={<LogoutCallback tokenManager={tokenManager} />}
        />
        <RouterPage path="/" element={<Homepage apiClient={apiClient} />} />
      </Router>
    </div>
  );
}
