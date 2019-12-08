import React from 'react';
import { ApiClient } from '../api-client';
import Puzzle from './Puzzle';
import { AppConfig } from '../config';

interface Props {
  apiClient: ApiClient;
  config: AppConfig;
}

export default function App({ apiClient, config }: Props) {
  const loginUrl = `${config.cognitoApiUri}/login?response_type=code&client_id=${config.cognitoClientId}&redirect_uri=${config.homepageUri}`;

  return (
    <div>
      <a href={loginUrl}>Login</a>
      <Puzzle apiClient={apiClient} />
    </div>
  );
}
