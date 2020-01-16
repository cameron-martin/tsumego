import React, { useContext } from 'react';
import { ApiClient } from '@tsumego/api-client';

const ApiClientContext = React.createContext<ApiClient | null>(null);

export function useApiClient(): ApiClient | null {
  return useContext(ApiClientContext);
}

export const ApiClientProvider: React.FC<{ apiClient: ApiClient | null }> = ({
  children,
  apiClient,
}) => {
  return (
    <ApiClientContext.Provider value={apiClient}>
      {children}
    </ApiClientContext.Provider>
  );
};
