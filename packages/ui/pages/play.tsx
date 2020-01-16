import React from 'react';
import StandardTemplate from '../src/view/StandardTemplate';
import Puzzle from '../src/view/Puzzle';
import { useApiClient } from '../src/apiClient';
import Loading from '../src/view/Loading';

export default function Index() {
  const apiClient = useApiClient();

  return (
    <StandardTemplate>
      {apiClient == null ? <Loading /> : <Puzzle apiClient={apiClient} />}
    </StandardTemplate>
  );
}
