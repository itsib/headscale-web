import { useQuery } from '@tanstack/react-query';
import { ApiToken, QueryResult } from '../types';

export function useApiTokens(): QueryResult<ApiToken[]> {
  const { data, isLoading, error } = useQuery<{ apiKeys: ApiToken[] }, Error, ApiToken[]>({
    queryKey: ['/api/v1/apikey'],
    select: ({ apiKeys }) => apiKeys,
    staleTime: 15_000,
    refetchInterval: 20_000,
  })

  return { data, isLoading, error };
}