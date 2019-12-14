import ReactDOM from 'react-dom';
import React from 'react';

import { ApiClient } from '@tsumego/api-client';
import {
  createBearerTokenMiddleware,
  WebAuthStorage,
  AuthStorageProxy,
  OAuth2AuthorisationCodeFlowTokenManager,
} from '@tsumego/api-client-authentication';
import App from './view/App';
import { getConfigFromEnv } from './config';
import { AuthProvider } from './view/auth/AuthProvider';

const config = getConfigFromEnv();

document.addEventListener('DOMContentLoaded', async () => {
  const storage = await AuthStorageProxy.create(
    new WebAuthStorage(localStorage),
  );

  const tokenManager = new OAuth2AuthorisationCodeFlowTokenManager({
    clientId: config.cognitoClientId,
    handler: request => fetch(request),
    redirectUri: `${config.uiHost}/auth/callback/login`,
    storage,
    tokenEndpoint: `${config.cognitoWebUri}/oauth2/token`,
  });

  const apiClient = new ApiClient({
    host: config.apiHost,
    middleware: [createBearerTokenMiddleware(tokenManager)],
  });

  ReactDOM.render(
    <AuthProvider authState={storage}>
      <App apiClient={apiClient} config={config} tokenManager={tokenManager} />
    </AuthProvider>,
    document.getElementById('app'),
  );
});
