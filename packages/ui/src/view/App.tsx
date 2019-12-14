import React, { Suspense } from 'react';
import { Router } from '@reach/router';
import { ApiClient } from '@tsumego/api-client';
import { OAuth2AuthorisationCodeFlowTokenManager } from '@tsumego/api-client-authentication';
import { AppConfig } from '../config';
import Header from './Header';
import RouterPage from './RouterPage';
import Loading from './Loading';

interface Props {
  apiClient: ApiClient;
  config: AppConfig;
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager;
}

export default function App({ apiClient, config, tokenManager }: Props) {
  return (
    <div>
      <Header config={config} />
      <Suspense fallback={<Loading />}>
        <Router>
          <RouterPage
            path="auth/callback/login"
            page={() => import('./auth/LoginCallback')}
            props={{ tokenManager }}
          />
          <RouterPage
            path="auth/callback/logout"
            page={() => import('./auth/LogoutCallback')}
            props={{ tokenManager }}
          />
          <RouterPage
            path="/"
            page={() => import('./Homepage')}
            props={{ apiClient }}
          />
        </Router>
      </Suspense>
    </div>
  );
}
