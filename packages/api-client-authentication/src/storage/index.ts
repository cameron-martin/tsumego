export interface AuthStorage {
  setAccessToken(value: string): Promise<void>;
  getAccessToken(): Promise<string | null>;
  deleteAccessToken(): Promise<void>;

  setRefreshToken(value: string): Promise<void>;
  getRefreshToken(): Promise<string | null>;
  deleteRefreshToken(): Promise<void>;
}
