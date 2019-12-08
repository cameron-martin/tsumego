import 'whatwg-fetch';
import { OAuth2AuthorisationCodeFlowTokenManager } from './OAuth2AuthorisationCodeFlowTokenManager';
import { MemoryStorage } from './storage/MemoryStorage';
import { AuthStorage } from './storage';
import { Handler } from '../requester';

const createMockHandler = () => {
  let tokenIndex = 1;
  return jest.fn<Promise<Response>, [Request]>(async () => {
    const currentIndex = tokenIndex++;

    return new Response(
      JSON.stringify({
        /* eslint-disable @typescript-eslint/camelcase */
        access_token: `accessToken${currentIndex}`,
        refresh_token: `refreshToken${currentIndex}`,
        id_token: `idToken${currentIndex}`,
        token_type: 'Bearer',
        expires_in: 3600,
        /* eslint-enable @typescript-eslint/camelcase */
      }),
    );
  });
};

const createTokenManager = ({
  storage,
  handler,
}: {
  storage: AuthStorage;
  handler: Handler;
}) =>
  new OAuth2AuthorisationCodeFlowTokenManager({
    storage,
    handler,
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
  });

const getBody = async (request: Request): Promise<URLSearchParams> => {
  return new URLSearchParams(await request.text());
};

test(`returns null if no authorization code is given`, async () => {
  const tokenManager = new OAuth2AuthorisationCodeFlowTokenManager({
    storage: new MemoryStorage(),
    handler: () => {
      throw new Error();
    },
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
  });

  expect(await tokenManager.getToken()).toBe(null);
});

test(`useAuthorizationCode returns token obtained via authorisation code`, async () => {
  const handler = createMockHandler();

  const tokenManager = createTokenManager({
    storage: new MemoryStorage(),
    handler,
  });

  tokenManager.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  await tokenManager.getToken();

  expect(handler).toHaveBeenCalledTimes(1);

  const request = handler.mock.calls[0][0];
  const body = await getBody(request);

  expect(request.method).toBe('POST');
  expect(request.headers.get('Content-Type')).toBe(
    'application/x-www-form-urlencoded',
  );
  expect(request.url).toBe('http://example.com/token');
  expect(body.get('grant_type')).toBe('authorization_code');
  expect(body.get('client_id')).toBe('my-client-id');
  expect(body.get('redirect_uri')).toBe('http://example.com/redirect');
  expect(body.get('code')).toBe('b9f3a3f4-bd1b-486b-b556-205863e7ee35');
});

test('getToken immediately waits and returns access token', async () => {
  const handler = createMockHandler();

  const tokenManager = createTokenManager({
    storage: new MemoryStorage(),
    handler,
  });

  tokenManager.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  expect(await tokenManager.getToken()).toBe('accessToken1');
});

test('refreshes access token using refresh token', async () => {
  const handler = createMockHandler();

  const tokenManager = createTokenManager({
    storage: new MemoryStorage(),
    handler,
  });

  tokenManager.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  await tokenManager.getToken();

  tokenManager.refreshToken();

  expect(await tokenManager.getToken()).toBe('accessToken2');

  expect(handler).toHaveBeenCalledTimes(2);

  const request = handler.mock.calls[1][0];
  const body = await getBody(request);

  expect(request.method).toBe('POST');
  expect(request.headers.get('Content-Type')).toBe(
    'application/x-www-form-urlencoded',
  );
  expect(request.url).toBe('http://example.com/token');
  expect(body.get('grant_type')).toBe('refresh_token');
  expect(body.get('client_id')).toBe('my-client-id');
  expect(body.get('refresh_token')).toBe('refreshToken1');
});

test('ignores refreshes while the initial token is being fetched', async () => {
  const handler = createMockHandler();

  const tokenManager = createTokenManager({
    storage: new MemoryStorage(),
    handler,
  });

  tokenManager.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  tokenManager.refreshToken();
  await tokenManager.getToken();

  expect(handler).toHaveBeenCalledTimes(1);
});

test('only refreshes once if multiple refreshes are done before refresh finishes', async () => {
  const handler = createMockHandler();

  const tokenManager = createTokenManager({
    storage: new MemoryStorage(),
    handler,
  });

  tokenManager.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  await tokenManager.getToken();

  tokenManager.refreshToken();
  tokenManager.refreshToken();

  await tokenManager.getToken();

  expect(handler).toHaveBeenCalledTimes(2);
});

test('it reuses access token from storage', async () => {
  const handler = createMockHandler();

  const storage = new MemoryStorage();

  const tokenManager1 = createTokenManager({
    storage,
    handler,
  });

  tokenManager1.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  const originalToken = await tokenManager1.getToken();

  const tokenManager2 = createTokenManager({
    storage,
    handler,
  });

  expect(await tokenManager2.getToken()).toBe(originalToken);
});

test('it reuses refresh token from storage', async () => {
  const handler = createMockHandler();

  const storage = new MemoryStorage();

  const tokenManager1 = createTokenManager({
    storage,
    handler,
  });

  tokenManager1.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  await tokenManager1.getToken();

  const tokenManager2 = createTokenManager({
    storage,
    handler,
  });

  tokenManager2.refreshToken();

  expect(await tokenManager2.getToken()).toBe('accessToken2');
  const body = await getBody(handler.mock.calls[1][0]);
  expect(body.get('refresh_token')).toBe('refreshToken1');
});
