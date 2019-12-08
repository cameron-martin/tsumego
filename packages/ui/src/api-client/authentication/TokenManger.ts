export interface TokenManager {
  /**
   * Gets a potentially cached auth token. This may not be valid, in which case clients can
   * get a new auth token using `getNewAuthToken`.
   */
  getToken(): Promise<string | null>;
  /**
   * Refreshses the access token. Calls to getToken will immediately return this new token.
   */
  refreshToken(): void;

  removeTokens(): Promise<void>;
}
