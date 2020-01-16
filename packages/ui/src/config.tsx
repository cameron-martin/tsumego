import { Record, Static, String } from 'runtypes';
import React, { useContext } from 'react';

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

const ConfigContext = React.createContext<AppConfig | null>(null);

export function useConfig() {
  const config = useContext(ConfigContext);

  if (config == null) {
    throw new Error('You must wrap your app in a config provider');
  }

  return config;
}

export const ConfigProvider: React.FC<{ config: AppConfig }> = ({
  children,
  config,
}) => (
  <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
);
