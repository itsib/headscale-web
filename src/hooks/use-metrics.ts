import { useQuery } from '@tanstack/react-query';
import { parseGoMetrics } from '../utils/parse-go-metrics.ts';
import { MetricRowProps, QueryResult, TokenType } from '../types';
import { fetchFn } from '../utils/query-fn.ts';

export function useMetrics(url?: string, token?: string, tokenType?: TokenType): QueryResult<MetricRowProps[]> {
  const { data, isLoading, error } = useQuery({
    queryKey: [url, token, tokenType],
    queryFn: async ({ queryKey, signal }) => {
      const url = queryKey[0] as string;
      const token = queryKey[1] as string;
      const tokenType = queryKey[2] as TokenType;
      const text = await fetchFn<string>(url, {
        signal,
        headers: {
          'Content-Type': 'text/plain;utf-8'
        }
      }, token, tokenType)

      return parseGoMetrics(text);
    },
    enabled: !!url && !!token,
    staleTime: 0,
    retry(_: any, error: any): any {
      if (error.code === 401) return false;
      return 3 as any;
    },
    refetchInterval: query => (query.state?.error ? false : 15_000),
  });

  return { data, isLoading, error };
}