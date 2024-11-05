import { useQuery } from '@tanstack/react-query';
import { parseGoMetrics } from '../utils/parse-go-metrics.ts';
import { MetricRowProps, QueryResult } from '../types';
import { fetchFn } from '../utils/query-fn.ts';

export function useMetrics(url: string): QueryResult<MetricRowProps[]> {
  const { data, isLoading, error } = useQuery({
    queryKey: [url],
    queryFn: async ({ queryKey, signal }) => {
      const url = queryKey[0] as string;
      const text = await fetchFn<string>(url, {
        signal,
        headers: {
          'Content-Type': 'text/plain;utf-8'
        }
      })

      return parseGoMetrics(text);
    },
    staleTime: 0,
    refetchInterval: 15_000,
  });

  return { data, isLoading, error };
}