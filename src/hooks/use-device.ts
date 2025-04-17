import { useQuery } from '@tanstack/react-query';
import { Device, QueryResult } from '@app-types';
import { useCallback } from 'react';

export function useDevice(id: string): QueryResult<Device> & { refetch: () => void } {
  const { data, isLoading, error, refetch: _refetch } = useQuery<{ node: Device }, Error, Device>({
    queryKey: [`/api/v1/node/${id}`],
    select: data => data.node,
  });

  const refetch = useCallback(async () => {
    await _refetch({ cancelRefetch: true });
  }, []);

  return { data, isLoading, error, refetch };
}