import { useQuery } from '@tanstack/react-query';
import { parseGoMetrics } from '../utils/parse-go-metrics.ts';
import { MetricRowProps, QueryResult } from '../types';

export function useMetrics(): QueryResult<MetricRowProps[]> {
  const { data, isLoading, error } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const base = localStorage.getItem('headscale.url');
      const req = await fetch(`${base}/metrics`, {
        headers: {
          'Content-Type': 'text/plain;utf-8'
        }
      });

      const text = await req.text();
      return parseGoMetrics(text);
    },
    enabled: true,
    staleTime: 0,
    refetchInterval: 15_000,
  });

  return { data, isLoading, error };
}