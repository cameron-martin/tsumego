import { Record, Static, String } from 'runtypes';

export const AppConfig = Record({
  uiHost: String,
  apiHost: String,
  cognitoClientId: String,
  cognitoWebUri: String,
});

export type AppConfig = Static<typeof AppConfig>;

export const getConfigFromEnv = (): AppConfig =>
  AppConfig.check({
    uiHost: process.env.UI_HOST,
    apiHost: process.env.API_HOST,
    cognitoClientId: process.env.COGNITO_CLIENT_ID,
    cognitoWebUri: process.env.COGNITO_WEB_URI,
  });
