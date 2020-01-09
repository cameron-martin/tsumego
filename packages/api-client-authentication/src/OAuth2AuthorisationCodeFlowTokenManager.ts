import { AuthStorage } from './storage';
import { TokenManager } from './TokenManger';
import { Handler } from '@tsumego/api-client';

interface Config {
  storage: AuthStorage;
  tokenEndpoint: string;
  /**
   * The handler for making the requests to the token endpoint
   */
  handler: Handler;
  /**
   * The OAuth2 client id
   */
  clientId: string;
  /**
   * The redirect URI that was used to get the authorisation code
   */
  redirectUri: string;
}

export class OAuth2AuthorisationCodeFlowTokenManager implements TokenManager {
  private accessToken = this.config.storage.getAccessToken();
  private _refreshToken = this.config.storage.getRefreshToken();
  private isFetching = false;
  constructor(private readonly config: Config) {}

  getToken(): Promise<string | null> {
    return this.accessToken;
  }

  refreshToken(): void {
    if (this.isFetching) {
      return;
    }

    this.isFetching = true;
    this.accessToken = this.getTokenUsingRefreshToken();

    this.accessToken.finally(() => {
      this.isFetching = false;
    });
  }

  /**
   * Fetches an auth & refresh token using the authorisation code in the URL.
   *
   * You can call getToken immediately after calling this and the returned
   * promise will not resolve until the auth token is fetched.
   */
  useAuthorizationCode(url: string): void {
    if (this.isFetching) {
      return;
    }

    const parsedUrl = new URL(url);
    const code = parsedUrl.searchParams.get('code');
    if (!code) throw new Error('No authorization code found!');

    this.isFetching = true;
    this.accessToken = this.getInitialToken(code);

    this.accessToken.finally(() => {
      this.isFetching = false;
    });
  }

  private async getInitialToken(code: string) {
    const requestBody = new URLSearchParams();
    requestBody.set('grant_type', 'authorization_code');
    requestBody.set('client_id', this.config.clientId);
    requestBody.set('redirect_uri', this.config.redirectUri);
    requestBody.set('code', code);

    return this.requestToken(requestBody);
  }

  private async getTokenUsingRefreshToken() {
    const refreshToken = await this._refreshToken;

    if (!refreshToken) {
      throw new Error('Cannot refresh without refresh token');
    }

    const requestBody = new URLSearchParams();
    requestBody.set('grant_type', 'refresh_token');
    requestBody.set('client_id', this.config.clientId);
    requestBody.set('refresh_token', refreshToken);

    return this.requestToken(requestBody);
  }

  private async requestToken(
    requestBody: URLSearchParams,
  ): Promise<string | null> {
    const response = await this.config.handler(
      new Request(this.config.tokenEndpoint, {
        method: 'POST',
        body: requestBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    if (!response.ok) {
      this._refreshToken = Promise.resolve(null);
      await this.removeTokens();

      return null;
    }

    const responseBody = await response.json();

    const refreshToken = responseBody.refresh_token;
    await this.config.storage.setRefreshToken(refreshToken);
    this._refreshToken = Promise.resolve(refreshToken);

    const token = responseBody.id_token;
    await this.config.storage.setAccessToken(token);

    return token;
  }

  async removeTokens(): Promise<void> {
    await Promise.all([
      this.config.storage.deleteRefreshToken(),
      this.config.storage.deleteAccessToken(),
    ]);
  }
}
