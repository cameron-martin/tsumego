import { AuthStorage } from './storage';
import { TokenManager } from './TokenManger';
import { Handler } from '../requester';

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
  private accessToken = this.config.storage.get('accessToken');
  private _refreshToken = this.config.storage.get('refreshToken');
  private isFetching = false;
  constructor(private readonly config: Config) {}

  async getToken(): Promise<string | null> {
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
   * You do not have to wait for the returned promise to resolve before you boot your app;
   * calls to getToken will wait for this process to finish automatically if it's currently in progress.
   */
  useAuthorizationCode(url: string): void {
    if (this.isFetching) {
      return;
    }

    this.isFetching = true;
    this.accessToken = this.getInitialToken(url);

    this.accessToken.finally(() => {
      this.isFetching = false;
    });
  }

  private async getInitialToken(url: string) {
    const parsedUrl = new URL(url);

    const code = parsedUrl.searchParams.get('code');

    if (!code) return null;

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

  private async requestToken(requestBody: URLSearchParams): Promise<string> {
    const response = await this.config.handler(
      new Request(this.config.tokenEndpoint, {
        method: 'POST',
        body: requestBody,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    );

    const responseBody = await response.json();

    const refreshToken = responseBody.refresh_token;
    await this.config.storage.set('refreshToken', refreshToken);
    this._refreshToken = Promise.resolve(refreshToken);

    const token = responseBody.access_token;
    await this.config.storage.set('accessToken', token);

    return token;
  }
}
