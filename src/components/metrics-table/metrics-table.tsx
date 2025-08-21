import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import { parseMetrics } from '@app-utils/parse-metrics';
import { useTranslation } from 'react-i18next';
import { MetricsRow } from '@app-components/metrics-table/_metrics-row';
import './metrics-table.css';

export interface MetricsTableProps {
  metrics: string;
}

export const MetricsTable: FunctionComponent<MetricsTableProps> = ({ metrics: rawMetrics }) => {
  const { t } = useTranslation();
  const metrics = useMemo(() => (rawMetrics ? parseMetrics(rawMetrics) : {}), [rawMetrics]);

  const systems = useMemo(() => Object.keys(metrics).sort(), [metrics]);

  return (
    <div className="metrics-table">
      {systems.map((system) => (
        <div key={`system-${system}`} className="system">
          <h2>{t(`metrics_system_${system}`)}</h2>

          <div>
            {metrics[system].map((metric) => (
              <MetricsRow key={`metric-${system}-${metric.id}`} {...metric} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
