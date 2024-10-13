import { useQuery } from '@tanstack/react-query';
import { NodeRoute } from '../types/nodes/node-route.ts';
import { useCallback } from 'react';
import { QueryResult } from '../types';

export function useNodeRoutes(nodeId?: string): QueryResult<NodeRoute[]> & { refetch: () => void } {
  const { data, isLoading, error, refetch: _refetch } = useQuery<{ routes: NodeRoute[] }, Error, NodeRoute[]>({
    queryKey: [`/api/v1/node/${nodeId}/routes`],
    enabled: !!nodeId,
    select: (data) => data.routes,
    staleTime: 15_000,
  });

  const refetch = useCallback(async () => {
    await _refetch({ cancelRefetch: true });
  }, []);

  return { data, isLoading, error, refetch };
}