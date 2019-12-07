import { Middleware } from '../requester';
import { TokenManager } from './TokenManger';

export class NotAuthenticated extends Error {}

export const createBearerTokenMiddleware = (
  tokenManager: TokenManager,
): Middleware => next => async request => {
  const accessToken = await tokenManager.getToken();

  if (accessToken != null) {
    request.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await next(request);

  if (response.status !== 401) {
    return response;
  }

  if (accessToken == null) {
    throw new NotAuthenticated();
  } else {
    tokenManager.refreshToken();
    const refreshedToken = await tokenManager.getToken();

    if (refreshedToken == null) {
      throw new NotAuthenticated();
    }

    request.headers.set('Authorization', `Bearer ${refreshedToken}`);

    const response = await next(request);

    if (response.status === 401) {
      throw new NotAuthenticated();
    }

    return response;
  }
};
