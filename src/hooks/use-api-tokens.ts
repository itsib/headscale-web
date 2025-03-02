import { useQuery } from '@tanstack/react-query';
import { ApiToken, QueryResult } from '@app-types';
import { useCallback } from 'react';

export function useApiTokens(): QueryResult<ApiToken[]> & { refetch: () => void } {
  const { data, isLoading, error, refetch: _refetch } = useQuery<{ apiKeys: ApiToken[] }, Error, ApiToken[]>({
    queryKey: ['/api/v1/apikey', 'GET'],
    select: ({ apiKeys }) => apiKeys,
    staleTime: 15_000,
    refetchInterval: 20_000,
  });

  const refetch = useCallback(() => {
    _refetch({ cancelRefetch: true }).catch(console.error);
  }, []);

  return { data, isLoading, error, refetch };
}