import ReactDOM from 'react-dom';
import React from 'react';

import App from './view/App';
import { ApiClient } from './api-client';
import { createBearerTokenMiddleware } from './api-client/authentication/middleware';
import { OAuth2AuthorisationCodeFlowTokenManager } from './api-client/authentication/OAuth2AuthorisationCodeFlowTokenManager';
import { getConfigFromEnv } from './config';
import { WebAuthStorage } from './api-client/authentication/storage/WebAuthStorage';
import { AuthStorageProxy } from './api-client/authentication/storage/AuthStorageProxy';

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
    <App
      apiClient={apiClient}
      config={config}
      tokenManager={tokenManager}
      authState={storage}
    />,
    document.getElementById('app'),
  );
});
