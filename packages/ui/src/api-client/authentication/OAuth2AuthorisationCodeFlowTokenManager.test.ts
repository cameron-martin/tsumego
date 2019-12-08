import 'whatwg-fetch';
import { OAuth2AuthorisationCodeFlowTokenManager } from './OAuth2AuthorisationCodeFlowTokenManager';
import { MemoryStorage } from './storage/MemoryStorage';
import { Handler } from '../requester';

const createMockHandler = (handler: Handler) => jest.fn(handler);

const getBody = async (request: Request): Promise<URLSearchParams> => {
  return new URLSearchParams(await request.text());
};

const createExampleResponse = (accessToken = 'eyJz9sdfsdfsdfsd') =>
  new Response(
    JSON.stringify({
      /* eslint-disable @typescript-eslint/camelcase */
      access_token: accessToken,
      refresh_token: 'dn43ud8uj32nk2je',
      id_token: 'dmcxd329ujdmkemkd349r',
      token_type: 'Bearer',
      expires_in: 3600,
      /* eslint-enable @typescript-eslint/camelcase */
    }),
  );

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
  const handler = createMockHandler(async () => createExampleResponse());

  const tokenManager = new OAuth2AuthorisationCodeFlowTokenManager({
    storage: new MemoryStorage(),
    handler,
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
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
  const handler = createMockHandler(async () => createExampleResponse());

  const tokenManager = new OAuth2AuthorisationCodeFlowTokenManager({
    storage: new MemoryStorage(),
    handler,
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
  });

  tokenManager.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  expect(await tokenManager.getToken()).toBe('eyJz9sdfsdfsdfsd');
});

test('refreshes access token using refresh token', async () => {
  const handler = createMockHandler(async request => {
    switch ((await getBody(request.clone())).get('grant_type')) {
      case 'authorization_code':
        return createExampleResponse('eyJz9sdfsdfsdfsd');
      case 'refresh_token':
        return createExampleResponse('M3NPzUX0ym8Fgxt');
      default:
        throw new Error();
    }
  });

  const tokenManager = new OAuth2AuthorisationCodeFlowTokenManager({
    storage: new MemoryStorage(),
    handler,
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
  });

  tokenManager.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  await tokenManager.getToken();

  tokenManager.refreshToken();

  expect(await tokenManager.getToken()).toBe('M3NPzUX0ym8Fgxt');

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
  expect(body.get('refresh_token')).toBe('dn43ud8uj32nk2je');
});

test('ignores refreshes while the initial token is being fetched', async () => {
  const handler = createMockHandler(async request => {
    switch ((await getBody(request.clone())).get('grant_type')) {
      case 'authorization_code':
        return createExampleResponse('eyJz9sdfsdfsdfsd');
      case 'refresh_token':
        return createExampleResponse('M3NPzUX0ym8Fgxt');
      default:
        throw new Error();
    }
  });

  const tokenManager = new OAuth2AuthorisationCodeFlowTokenManager({
    storage: new MemoryStorage(),
    handler,
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
  });

  tokenManager.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  tokenManager.refreshToken();
  await tokenManager.getToken();

  expect(handler).toHaveBeenCalledTimes(1);
});

test('only refreshes once if multiple refreshes are done before refresh finishes', async () => {
  const handler = createMockHandler(async request => {
    switch ((await getBody(request.clone())).get('grant_type')) {
      case 'authorization_code':
        return createExampleResponse('eyJz9sdfsdfsdfsd');
      case 'refresh_token':
        return createExampleResponse('M3NPzUX0ym8Fgxt');
      default:
        throw new Error();
    }
  });

  const tokenManager = new OAuth2AuthorisationCodeFlowTokenManager({
    storage: new MemoryStorage(),
    handler,
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
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
  const handler = createMockHandler(async request => {
    switch ((await getBody(request.clone())).get('grant_type')) {
      case 'authorization_code':
        return createExampleResponse('eyJz9sdfsdfsdfsd');
      case 'refresh_token':
        return createExampleResponse('M3NPzUX0ym8Fgxt');
      default:
        throw new Error();
    }
  });

  const storage = new MemoryStorage();

  const tokenManager1 = new OAuth2AuthorisationCodeFlowTokenManager({
    storage,
    handler,
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
  });

  tokenManager1.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  const originalToken = await tokenManager1.getToken();

  const tokenManager2 = new OAuth2AuthorisationCodeFlowTokenManager({
    storage,
    handler,
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
  });

  expect(await tokenManager2.getToken()).toBe(originalToken);
});

test('it reuses refresh token from storage', async () => {
  const handler = createMockHandler(async request => {
    switch ((await getBody(request.clone())).get('grant_type')) {
      case 'authorization_code':
        return createExampleResponse('eyJz9sdfsdfsdfsd');
      case 'refresh_token':
        return createExampleResponse('M3NPzUX0ym8Fgxt');
      default:
        throw new Error();
    }
  });

  const storage = new MemoryStorage();

  const tokenManager1 = new OAuth2AuthorisationCodeFlowTokenManager({
    storage,
    handler,
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
  });

  tokenManager1.useAuthorizationCode(
    'http://example.com/redirect?code=b9f3a3f4-bd1b-486b-b556-205863e7ee35',
  );

  await tokenManager1.getToken();

  const tokenManager2 = new OAuth2AuthorisationCodeFlowTokenManager({
    storage,
    handler,
    tokenEndpoint: 'http://example.com/token',
    clientId: 'my-client-id',
    redirectUri: 'http://example.com/redirect',
  });

  tokenManager2.refreshToken();

  expect(await tokenManager2.getToken()).toBe('M3NPzUX0ym8Fgxt');
  const body = await getBody(handler.mock.calls[1][0]);
  expect(body.get('refresh_token')).toBe('dn43ud8uj32nk2je');
});
