import { FC } from 'react';
import { MetricItem } from './-metric-row.tsx';
import { useTranslation } from 'react-i18next';
import { Metric } from '@app-types';

export interface GroupBlockProps {
  group: string;
  metrics: Metric[];
}

export const GroupBlock: FC<GroupBlockProps> = ({ group, metrics }) => {
  const { t } = useTranslation();

  return (
    <div key={group} className="">
      <h2 className="mt-10">{t(`metrics_system_${group}`)}</h2>

      <div>
        {metrics.map(metric => {
          return (
            <MetricItem key={ `metric_${group}_${metric.id}`} {...metric} />
          );
        })}
      </div>
    </div>
  )
}