import { FC } from 'react';
import { useAppCredentials } from '../../hooks/use-app-credentials.ts';
import { MetricContent } from './_metric-content.tsx';
import { MetricNoUrl } from './_metric-no-url.tsx';

export const MetricsPage: FC = () => {
  const { metricsUrl } = useAppCredentials();

  return metricsUrl ? <MetricContent metricsUrl={metricsUrl} /> : <MetricNoUrl />
}