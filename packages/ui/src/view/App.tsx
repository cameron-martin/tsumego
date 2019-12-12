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
import { AuthState } from '../api-client/authentication/AuthState';

interface Props {
  apiClient: ApiClient;
  authState: AuthState;
  config: AppConfig;
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager;
}

export default function App({
  apiClient,
  config,
  tokenManager,
  authState,
}: Props) {
  return (
    <div>
      <Header config={config} authState={authState} />
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
