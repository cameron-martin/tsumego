import ReactDOM from 'react-dom';
import React from 'react';

import App from './view/App';
import { ApiClient } from './api-client';
import { createBearerTokenMiddleware } from './api-client/authentication/middleware';
import { OAuth2AuthorisationCodeFlowTokenManager } from './api-client/authentication/OAuth2AuthorisationCodeFlowTokenManager';
import { MemoryStorage } from './api-client/authentication/storage/MemoryStorage';
import { getConfigFromEnv } from './config';

const config = getConfigFromEnv();

const tokenManager = new OAuth2AuthorisationCodeFlowTokenManager({
  clientId: config.cognitoClientId,
  handler: request => fetch(request),
  redirectUri: config.homepageUri,
  storage: new MemoryStorage(),
  tokenEndpoint: `${config.cognitoApiUri}/oauth2/token`,
});

tokenManager.useAuthorizationCode(window.location.href);

const apiClient = new ApiClient({
  host: config.apiHost,
  middleware: [createBearerTokenMiddleware(tokenManager)],
});

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App apiClient={apiClient} />,
    document.getElementById('app'),
  );
});
