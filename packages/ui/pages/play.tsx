import React, { useEffect } from 'react';
import Router from 'next/router';
import StandardTemplate from '../src/view/StandardTemplate';
import Puzzle from '../src/view/Puzzle';
import { useApiClient } from '../src/apiClient';
import Loading from '../src/view/Loading';
import { useAuth } from '../src/view/auth/AuthProvider';

export default function Index() {
  const apiClient = useApiClient();
  const authState = useAuth();

  useEffect(() => {
    if (authState && !authState.userId) {
      Router.replace('/');
    }
  }, [authState]);

  return (
    <StandardTemplate>
      {apiClient == null || authState == null || authState.userId == null ? (
        <Loading />
      ) : (
        <Puzzle apiClient={apiClient} />
      )}
    </StandardTemplate>
  );
}
