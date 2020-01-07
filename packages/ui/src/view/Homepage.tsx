import { useAuth } from './auth/AuthProvider';
import React from 'react';
import { ApiClient } from '@tsumego/api-client';
import Puzzle from './Puzzle';
import { Container } from '@material-ui/core';

interface Props {
  apiClient: ApiClient;
}

export default function Homepage({ apiClient }: Props) {
  const isLoggedIn = useAuth();

  if (isLoggedIn) {
    return <Puzzle apiClient={apiClient} />;
  } else {
    return (
      <Container maxWidth="sm">
        <div>You must be logged in to use the app</div>
      </Container>
    );
  }
}
