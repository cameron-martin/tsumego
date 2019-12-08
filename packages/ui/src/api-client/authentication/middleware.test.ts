import 'whatwg-fetch';
import { createBearerTokenMiddleware, NotAuthenticated } from './middleware';
import { Handler } from '../requester';
import { TokenManager } from './TokenManger';

const createMockHandler = (handler: Handler) => jest.fn(handler);

test('if endpoint requires authentication and no credentials are available, NotAuthenticated is thrown', async () => {
  const handler: Handler = async () =>
    new Response('', {
      status: 401,
    });

  const tokenManager: TokenManager = {
    getToken: () => Promise.resolve(null),
    refreshToken: () => undefined,
  };

  const request = new Request('http://example.com');

  const middleware = createBearerTokenMiddleware(tokenManager);

  await expect(middleware(handler)(request)).rejects.toBeInstanceOf(
    NotAuthenticated,
  );
});

test('if endpoint does not require authentication and no credentials are available then it passes through', async () => {
  const response = new Response('', {
    status: 200,
  });

  const handler: Handler = async () => response;

  const tokenManager: TokenManager = {
    getToken: () => Promise.resolve(null),
    refreshToken: () => undefined,
  };

  const request = new Request('http://example.com');

  const middleware = createBearerTokenMiddleware(tokenManager);

  expect(await middleware(handler)(request)).toBe(response);
});

test('if credentials are available then it adds them to the request', async () => {
  const response = new Response('', {
    status: 200,
  });

  const handler = createMockHandler(async () => response);

  const tokenManager: TokenManager = {
    getToken: () => Promise.resolve('myToken'),
    refreshToken: () => undefined,
  };

  const request = new Request('http://example.com');

  const middleware = createBearerTokenMiddleware(tokenManager);

  await middleware(handler)(request);

  expect(handler.mock.calls[0][0].headers.get('Authorization')).toBe(
    `Bearer myToken`,
  );
});

test('if credentials are provided but still returns unauthenticated then it uses refreshed token', async () => {
  const okResponse = new Response('', {
    status: 200,
  });

  const unauthorisedResponse = new Response('', {
    status: 401,
  });

  const handler = createMockHandler(async request =>
    request.headers.get('Authorization') === 'Bearer refreshedToken'
      ? okResponse
      : unauthorisedResponse,
  );

  let token = 'myToken';

  const tokenManager: TokenManager = {
    getToken: () => Promise.resolve(token),
    refreshToken() {
      token = 'refreshedToken';
    },
  };

  const request = new Request('http://example.com');

  const middleware = createBearerTokenMiddleware(tokenManager);

  await middleware(handler)(request);

  expect(handler.mock.calls[1][0].headers.get('Authorization')).toBe(
    `Bearer refreshedToken`,
  );
});

test('if credentials and refreshed token are provided and it still returns unauthorised then NotAuthenticated is thrown', async () => {
  const unauthorisedResponse = new Response('', {
    status: 401,
  });

  const handler = createMockHandler(async () => unauthorisedResponse);

  let token = 'myToken';

  const tokenManager: TokenManager = {
    getToken: () => Promise.resolve(token),
    refreshToken() {
      token = 'refreshedToken';
    },
  };

  const request = new Request('http://example.com');

  const middleware = createBearerTokenMiddleware(tokenManager);

  await expect(middleware(handler)(request)).rejects.toBeInstanceOf(
    NotAuthenticated,
  );
});

test('if incorrect access token is given but token cannot refresh then it throws unauthorised, and does not retry request', async () => {
  const unauthorisedResponse = new Response('', {
    status: 401,
  });

  const handler = createMockHandler(async () => unauthorisedResponse);

  let token: string | null = 'myToken';

  const tokenManager: TokenManager = {
    getToken: () => Promise.resolve(token),
    refreshToken() {
      token = null;
    },
  };

  const request = new Request('http://example.com');

  const middleware = createBearerTokenMiddleware(tokenManager);

  await expect(middleware(handler)(request)).rejects.toBeInstanceOf(
    NotAuthenticated,
  );

  expect(handler).toHaveBeenCalledTimes(1);
});
