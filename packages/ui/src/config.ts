import { Record, Static, String } from 'runtypes';

export const AppConfig = Record({
  homepageUri: String,
  apiHost: String,
  cognitoClientId: String,
  cognitoApiUri: String,
});

export type AppConfig = Static<typeof AppConfig>;

export const getConfigFromEnv = (): AppConfig =>
  AppConfig.check({
    homepageUri: process.env.HOMEPAGE_URI,
    apiHost: process.env.API_HOST,
    cognitoClientId: process.env.COGNITO_CLIENT_ID,
    cognitoApiUri: process.env.COGNITO_API_URI,
  });
