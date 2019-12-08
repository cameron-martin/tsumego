import ReactDOM from 'react-dom';
import React from 'react';

import App from './view/App';
import { ApiClient } from './api-client';
import { createBearerTokenMiddleware } from './api-client/authentication/middleware';
import { OAuth2AuthorisationCodeFlowTokenManager } from './api-client/authentication/OAuth2AuthorisationCodeFlowTokenManager';
import { getConfigFromEnv } from './config';
import { WebStorage } from './api-client/authentication/storage/WebStorage';

const config = getConfigFromEnv();

const tokenManager = new OAuth2AuthorisationCodeFlowTokenManager({
  clientId: config.cognitoClientId,
  handler: request => fetch(request),
  redirectUri: `${config.uiHost}/auth/callback/login`,
  storage: new WebStorage(localStorage),
  tokenEndpoint: `${config.cognitoApiUri}/oauth2/token`,
});

const apiClient = new ApiClient({
  host: config.apiHost,
  middleware: [createBearerTokenMiddleware(tokenManager)],
});

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App apiClient={apiClient} config={config} tokenManager={tokenManager} />,
    document.getElementById('app'),
  );
});
