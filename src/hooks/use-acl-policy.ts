import { Query, useQuery } from '@tanstack/react-query';
import { AclPolicy, QueryResult } from '../types';

export function useAclPolicy(): QueryResult<AclPolicy> {
  const { data, isLoading, error } = useQuery<AclPolicy>({
    queryKey: ['/api/v1/policy'],
    enabled(query: Query<AclPolicy>) {
      return !query.state.data;
    },
    staleTime: Infinity,
    retry: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
  });

  return { data, isLoading, error };
}