import { useQuery } from '@tanstack/react-query';
import { useLog } from './use-log.ts';

export function useNodeBackfillips() {
  // backfillips

  const { data } = useQuery({
    queryKey: ['/metrics'],
    retry: false,
    staleTime: 0,
  });

  useLog({ data });
}