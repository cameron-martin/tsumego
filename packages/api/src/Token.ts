import { Record, String, Array, Static, Undefined, Union } from 'runtypes';

export const Token = Record({
  sub: String,
  'cognito:groups': Array(String),
});

export type Token = Static<typeof Token>;

const Request = Record({
  user: Token,
});

const OptionalRequest = Record({
  user: Union(Undefined, Token),
});

export const getToken = (request: unknown) => Request.check(request).user;
export const maybeGetToken = (request: unknown) =>
  OptionalRequest.check(request).user;
