import { AppConfig } from '../../config';

export const getLoginUrl = (config: AppConfig) =>
  `${config.cognitoWebUri}/login?response_type=code&client_id=${config.cognitoClientId}&redirect_uri=${config.uiHost}/auth/callback/login`;

export const getSignupUrl = (config: AppConfig) =>
  `${config.cognitoWebUri}/signup?response_type=code&client_id=${config.cognitoClientId}&redirect_uri=${config.uiHost}/auth/callback/login`;

export const getLogoutUrl = (config: AppConfig) =>
  `${config.cognitoWebUri}/logout?client_id=${config.cognitoClientId}&logout_uri=${config.uiHost}/auth/callback/logout`;
