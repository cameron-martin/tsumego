import React from 'react';
import { ApiClient } from '@tsumego/api-client';
import { useAuth } from './auth/AuthProvider';
import { AppConfig } from '../config';
import Puzzle from './Puzzle';
import SplashPage from './splashPage/SplashPage';

interface Props {
  apiClient: ApiClient;
  config: AppConfig;
}

export default function Homepage({ apiClient, config }: Props) {
  const userId = useAuth();

  if (userId) {
    return <Puzzle apiClient={apiClient} />;
  } else {
    return <SplashPage config={config} />;
  }
}
