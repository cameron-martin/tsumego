import React from 'react';
import { Router } from '@reach/router';
import { ApiClient } from '../api-client';
import { AppConfig } from '../config';
import { OAuth2AuthorisationCodeFlowTokenManager } from '../api-client/authentication/OAuth2AuthorisationCodeFlowTokenManager';
import Header from './Header';
import RouterPage from './RouterPage';
import LoginCallback from './auth/LoginCallback';
import LogoutCallback from './auth/LogoutCallback';
import Puzzle from './Puzzle';

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
        <RouterPage path="/" element={<Puzzle apiClient={apiClient} />} />
      </Router>
    </div>
  );
}
