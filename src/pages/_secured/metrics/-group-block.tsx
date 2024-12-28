import { FC, useMemo } from 'react';
import { MetricItem } from './-metric-row.tsx';
  import { useTranslation } from 'react-i18next';
import { MetricRowProps } from '../../../types';

export interface GroupBlockProps {
  group: string;
  metrics: { [id: string]: MetricRowProps };
}

export const GroupBlock: FC<GroupBlockProps> = ({ group, metrics: _metrics }) => {
  const { t } = useTranslation();

  const metrics = useMemo(() => Object.values(_metrics), [_metrics]);

  return (
    <div key={group} className="">
      <h2 className="mt-10">{t(`metrics_group.${group}`)}</h2>

      <div>
        {metrics.map(metric => {
          const key = `metric_${group}_${metric.id}`;
          console.log(key);
          return (
            <MetricItem key={key} {...metric} />
          );
        })}
      </div>
    </div>
  )
}