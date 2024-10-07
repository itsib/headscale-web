import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { QueryResult, Node } from '../types';

export function useNodes(): QueryResult<Node[]> & { refetch: () => void } {
  const { data, isLoading, error, refetch: _refetch } = useQuery<{ nodes: Node[] }, Error, Node[]>({
    queryKey: ['/api/v1/node'],
    enabled: true,
    select: (data) => data.nodes,
    staleTime: 15_000,
    refetchInterval: 20_000,
  });

  const refetch = useCallback(async () => {
    await _refetch({ cancelRefetch: true });
  }, []);

  return { data, isLoading, error, refetch };
}