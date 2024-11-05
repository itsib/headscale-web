import { useQueries } from '@tanstack/react-query';
import { AuthKey, AuthKeyWithUser, QueryResult } from '../types';
import { useUsers } from './use-users.ts';
import { useCallback, useMemo } from 'react';
import { fetchFn } from '../utils/query-fn.ts';

export function useAuthKeys(): QueryResult<AuthKeyWithUser[]> & { refetch: () => void } {
  const { data: users } = useUsers();

  const queries = useMemo(() => {
    if (!users) {
      return [];
    }
    return users.map(user => ({
      queryKey: [`/api/v1/preauthkey?user=${user.name}`],
      queryFn: ({ queryKey, signal }: any) => fetchFn<{ preAuthKeys: AuthKey[] }>(queryKey[0], {
        signal,
      }),
      staleTime: 30_000,
      select: ({ preAuthKeys }: { preAuthKeys: AuthKey[] }) => preAuthKeys.map(key => ({ ...key, user, })),
    }))
  }, [users])

  const { data, isLoading, error, refetch: _refetch } = useQueries({
    queries,
    combine: (results) => {
      return {
        data: results.flatMap((result) => result.data as any as AuthKeyWithUser[]),
        isLoading: results.some((result) => result.isLoading),
        error: results.find((result) => !!result.error)?.error, // results
        refetch: async () => {
          return await Promise.all(results.map(result => result.refetch({ cancelRefetch: true })))
        },
      };
    }
  });

  const refetch = useCallback(() => {
    _refetch().catch(console.error);
  }, []);

  return { data, isLoading, error, refetch };
}
