import jwksRsa from 'jwks-rsa';
import jwt from 'express-jwt';

export const GOOGLE_ISSUER = 'https://accounts.google.com';

interface Params {
  cognitoIdpUri: string;
  cognitoClientId: string | undefined;
  gcpAudience: string | undefined;
}

export const createAuthMiddleware = ({
  cognitoIdpUri,
  cognitoClientId,
  gcpAudience,
}: Params) => {
  const cognitoSecret = jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${cognitoIdpUri}/.well-known/jwks.json`,
  });

  const googleSecret = jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://www.googleapis.com/oauth2/v3/certs`,
  });

  return jwt({
    secret: (req, jwtHeaders, jwtPayload, done) => {
      const { iss, aud } = jwtPayload;

      switch (iss) {
        case GOOGLE_ISSUER:
          if (aud !== gcpAudience) {
            done(
              new jwt.UnauthorizedError('invalid_token', {
                message: `Invalid audience: ${aud}`,
              }),
            );
          } else {
            googleSecret(req, jwtHeaders, jwtPayload, done);
          }
          break;

        case cognitoIdpUri:
          if (aud !== cognitoClientId) {
            done(
              new jwt.UnauthorizedError('invalid_token', {
                message: `Invalid audience: ${aud}`,
              }),
            );
          } else {
            cognitoSecret(req, jwtHeaders, jwtPayload, done);
          }
          break;

        default:
          done(
            new jwt.UnauthorizedError('invalid_token', {
              message: `Invalid issuer: ${iss}`,
            }),
          );
      }
    },
    algorithms: ['RS256'],
  });
};
