import { useMetrics } from '../../hooks/use-metrics.ts';
import { FC, useMemo } from 'react';
import { MetricRowProps } from '../../types';
import { Trans, useTranslation } from 'react-i18next';
import { ListLoading } from '../../components/skeleton/list-loading.tsx';
import { MetricItem } from './_metric-row.tsx';

export interface MetricContentProps {
  metricsUrl: string;
}

export const MetricContent: FC<MetricContentProps> = ({ metricsUrl }) => {
  const { t } = useTranslation();
  const { data: metrics, isLoading } = useMetrics(metricsUrl);

  const grouping = useMemo(() => {
    if (!metrics) {
      return {};
    }
    const grouping: { [group: string]: MetricRowProps[] } = {};
    for (let i = 0; i < metrics.length; i++) {
      const metric = metrics[i];

      grouping[metric.group] = (grouping[metric.group] || [])
      grouping[metric.group].push(metric);
    }
    return grouping;
  }, [metrics]);

  const groups = useMemo(() => Object.keys(grouping).sort(), [grouping]);

  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2"><Trans i18nKey="metrics"/></h1>
          <p className="text-secondary"><Trans i18nKey="metrics_page_subtitle"/></p>
        </div>
      </div>

      {isLoading ? (
        <ListLoading />
      ) : groups.length ? (
        <>
          {groups.map(group => (
            <div key={group} className="">
              <h2 className="mt-10">{t(`metrics_group.${group}`)}</h2>

              <div>
                {grouping[group].map(metric => <MetricItem key={`${group}_${metric.id}`} {...metric} />)}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="border-primary border rounded-md p-8 text-center">
          <Trans i18nKey="empty_list"/>
        </div>
      )}
    </div>
  );
}