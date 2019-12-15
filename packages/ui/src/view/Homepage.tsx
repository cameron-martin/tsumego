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

  return (
    <Container maxWidth="sm">
      {isLoggedIn ? (
        <Puzzle apiClient={apiClient} />
      ) : (
        <div>You must be logged in to use the app</div>
      )}
    </Container>
  );
}
