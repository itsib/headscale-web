import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QueryResult, User } from '../types';

export function useUsers(): QueryResult<User[]> & { refetch: () => void } {
  const { data, isLoading, error, refetch: _refetch } = useQuery<{ users: User[] }, Error, User[]>({
    queryKey: ['/api/v1/user'],
    select: (data) => data.users,
  });

  const refetch = useCallback(async () => {
    await _refetch({ cancelRefetch: true });
  }, []);

  return { data, isLoading, error, refetch };
}