import { useQuery } from '@tanstack/react-query';
import type { AuthKey, AuthKeyWithUser, QueryResult } from '@app-types';
import { useUsers } from './use-users.ts';
import { fetchFn } from '@app-utils/query-fn.ts';

export function useAuthKeys(): QueryResult<AuthKeyWithUser[]> {
  const { data: users, isLoading: isLoading0, error: error0 } = useUsers();

  const {
    data: authKeys,
    error: error1,
    isLoading: isLoading1,
  } = useQuery({
    queryKey: ['/api/v1/preauthkey'],
    async queryFn({ signal }) {
      const promises = new Array<Promise<AuthKeyWithUser[]>>(users!.length);

      for (let i = 0; i < users!.length; i++) {
        promises[i] = fetchFn<{ preAuthKeys: AuthKey[] }>(`/api/v1/preauthkey?user=${users![i].id}`, { signal })
          .then(result => {
            return result?.preAuthKeys?.map((key) => ({ ...key, user: users![i] }));
          })
          .catch(() => []);
      }

      return (await Promise.all(promises)).flat();
    },
    enabled: !!users,
  });

  return {
    data: authKeys,
    isLoading: isLoading0 || isLoading1,
    error: error0 || error1,
  };
}
