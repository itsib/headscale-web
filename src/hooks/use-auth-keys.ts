import { useQueries } from '@tanstack/react-query';
import { AuthKey, AuthKeyWithUser, QueryResult } from '@app-types';
import { useUsers } from './use-users.ts';
import { useCallback, useMemo } from 'react';
import { fetchWithContext } from '@app-utils/query-fn';
import { useStorage } from '@app-hooks/use-storage.ts';

export function useAuthKeys(): QueryResult<AuthKeyWithUser[]> & { refetch: () => void } {
  const { data: users, isLoading: isLoading0, error: error0 } = useUsers();
  const storage = useStorage();

  const queries = useMemo(() => {
    if (!users) {
      return [];
    }
    return users.map(user => ({
      queryKey: ['/api/v1/preauthkey', 'GET', user.name],
      queryFn: async ({ queryKey, signal }: any) => {
        try {
          const url = queryKey[0] + '?user=' + queryKey[2];
          const result = await fetchWithContext<{ preAuthKeys: AuthKey[] }>(url, { signal, method: queryKey[1] }, storage);
          return result.preAuthKeys;
        } catch(error: any) {
          if (error.code === 500) {
            return [];
          }
          throw error;
        }

      },
      staleTime: 30_000,
      select: (preAuthKeys: AuthKey[]) => preAuthKeys.map(key => ({ ...key, user, })),
    }))
  }, [users])

  const { data, isLoading: isLoading1, error: error1, refetch: _refetch } = useQueries({
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
    },
  });

  const refetch = useCallback(() => {
    _refetch().catch(console.error);
  }, []);

  return {
    data,
    isLoading: isLoading0 || isLoading1,
    error: error0 || error1,
    refetch,
  };
}
