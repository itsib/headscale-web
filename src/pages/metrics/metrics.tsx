import { FC, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useMetrics } from '../../hooks/use-metrics.ts';
import { Credentials, MetricRowProps } from '../../types';
import { ListLoading } from '../../components/skeleton/list-loading.tsx';
import { MetricItem } from './_metric-row.tsx';
import { ModalMetricsUrl } from '../../components/modals/modal-metrics-url/modal-metrics-url.tsx';
import { getStoredCredentials, setStoredCredentials } from '../../utils/local-storage.ts';

export const MetricsPage: FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [credentials, setCredentials] = useState(getStoredCredentials('metrics'));
  const { data: metrics, isLoading } = useMetrics(credentials.url, credentials.token, credentials.tokenType);

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

  function onSuccess(credentials: Required<Credentials>) {
    setStoredCredentials(credentials, 'metrics');
    setCredentials(credentials);
  }

  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2"><Trans i18nKey="metrics"/></h1>
          <p className="text-secondary"><Trans i18nKey="metrics_page_subtitle"/></p>
        </div>
        {credentials.url ? (
          <div className="text-secondary text-sm">
          <span>
            <Trans
              i18nKey="metric_server_url"
              components={{ span: <span className="text-primary">{credentials.url}</span> }}
            />
          </span>
            <button className="ml-2 size-6 relative top-[7px] transition opacity-70 hover:opacity-100" onClick={() => setIsModalOpen(true)}>
              <i className="icon icon-edit-url text-lg" />
            </button>
          </div>
        ) : null}
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
          <div>
            <Trans i18nKey="empty_list"/>
          </div>

          <div className="">
            <button type="button" className="leading-6 underline hover:no-underline" onClick={() => setIsModalOpen(true)}>
              <Trans i18nKey="edit_metrics_url" />
            </button>
          </div>
        </div>
      )}

      <ModalMetricsUrl isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)} credentials={credentials} onSuccess={onSuccess}  />
    </div>
  );
}