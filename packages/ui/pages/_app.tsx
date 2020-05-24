import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import { AuthProvider } from '../src/view/auth/AuthProvider';
import {
  AuthContainer,
  nullAuthContainer,
  WebAuthStorage,
  AuthStorageProxy,
  OAuth2AuthorisationCodeFlowTokenManager,
  createBearerTokenMiddleware,
} from '@tsumego/api-client-authentication';
import { getConfigFromEnv, ConfigProvider } from '../src/config';
import { ApiClientProvider } from '../src/apiClient';
import { ApiClient } from '@tsumego/api-client';
import Tracking from '../src/view/Tracking';

interface State {
  authContainer: AuthContainer;
  tokenManager: OAuth2AuthorisationCodeFlowTokenManager | null;
  apiClient: ApiClient | null;
}

const config = getConfigFromEnv();

export default class MyApp extends App<unknown, unknown, State> {
  state = {
    authContainer: nullAuthContainer,
    tokenManager: null,
    apiClient: null,
  };

  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }

    const storage = new AuthStorageProxy(new WebAuthStorage(localStorage));
    void storage.load();

    const tokenManager = new OAuth2AuthorisationCodeFlowTokenManager({
      clientId: config.cognitoClientId,
      handler: (request) => fetch(request),
      redirectUri: `${config.uiHost}/auth/callback/login`,
      storage,
      tokenEndpoint: `${config.cognitoWebUri}/oauth2/token`,
    });

    const apiClient = new ApiClient({
      host: config.apiHost,
      middleware: [createBearerTokenMiddleware(tokenManager)],
    });

    this.setState({ authContainer: storage, tokenManager, apiClient });
  }

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Tsumego.app - Play Free Go Problems</title>
          <meta
            name="description"
            content="Thousands of free tsumego problems for you to play. You're automatically ranked and shown puzzles of the correct difficulty. Come and play!"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <ApiClientProvider apiClient={this.state.apiClient}>
          <ConfigProvider config={config}>
            <AuthProvider authContainer={this.state.authContainer}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Tracking />
                <Component
                  {...pageProps}
                  tokenManager={this.state.tokenManager}
                />
              </ThemeProvider>
            </AuthProvider>
          </ConfigProvider>
        </ApiClientProvider>
      </React.Fragment>
    );
  }
}
