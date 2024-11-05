import { useContext } from 'react';
import { AuthContext } from '../context/auth/auth.context.ts';

export function useAppMetricsUrl(): [string | undefined, (metricUrl: string) => void] {
  const { metricsUrl, setMetricUrl } = useContext(AuthContext);
  return [metricsUrl, setMetricUrl];
}