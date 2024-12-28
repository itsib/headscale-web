import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QueryResult, UserWithProvider } from '../types';

export function useUsers(): QueryResult<UserWithProvider[]> & { refetch: () => void } {
  const { data, isLoading, error, refetch: _refetch } = useQuery<{ users: UserWithProvider[] }, Error, UserWithProvider[]>({
    queryKey: ['/api/v1/user'],
    select: (data) => data.users,
    refetchInterval: 20_000,
  });

  const refetch = useCallback(async () => {
    await _refetch({ cancelRefetch: true });
  }, []);

  return { data, isLoading, error, refetch };
}