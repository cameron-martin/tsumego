import { Record, String, Array, Static, Undefined, Union } from 'runtypes';

export const Token = Record({
  sub: String,
  'cognito:groups': Array(String),
});

export type Token = Static<typeof Token>;

export const getToken = (request: any) => Token.check(request.user);
export const maybeGetToken = (request: any) =>
  Union(Undefined, Token).check(request.user);
