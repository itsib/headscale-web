import { createFileRoute } from '@tanstack/react-router';
import { Trans } from 'react-i18next';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useMetrics } from '../../../hooks/use-metrics.ts';
import { Credentials, MetricRowProps } from '../../../types';
import { ListLoading } from '../../../components/skeleton/list-loading.tsx';
import { ModalMetricsUrl } from '../../../components/modals/modal-metrics-url/modal-metrics-url.tsx';
import ApplicationContext from '../../../context/application/application.context.ts';
import { getCredentials, setCredentials } from '../../../utils/credentials.ts';
import { GroupBlock } from './-group-block.tsx';

export const Route = createFileRoute('/_secured/metrics/')({
  component: Component,
});

function Component() {
  const { storage } = useContext(ApplicationContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metricCredentials, setMetricCredentials] = useState<Partial<Credentials> | null>(null);

  const { data: metrics, isLoading } = useMetrics(metricCredentials);

  const grouping = useMemo(() => {
    if (!metrics) {
      return {};
    }
    const grouping: { [group: string]: { [id: string]: MetricRowProps } } = {};

    for (let i = 0; i < metrics.length; i++) {
      const metric = metrics[i];

      grouping[metric.group] = grouping[metric.group] || {};
      grouping[metric.group][metric.id] = metric;
    }
    return grouping;
  }, [metrics]);

  const groups = useMemo(() => Object.keys(grouping).sort(), [grouping]);

  async function onSuccess(credentials: Required<Credentials>) {
    await setCredentials(storage, { ...credentials, component: 'metric' });
    setMetricCredentials(credentials);
  }

  useEffect(() => {
    getCredentials(storage, 'metric')
      .then(setMetricCredentials)
      .catch(() => {
      });
  }, []);

  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="metrics"/>
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="metrics_page_subtitle"/>
          </p>
        </div>
        {metricCredentials?.base ? (
          <div className="text-secondary text-sm">
            <span>
              <Trans
                i18nKey="metric_server_url"
                components={{
                  span: (
                    <span className="text-primary">{metricCredentials.base}</span>
                  ),
                }}
              />
            </span>
            <button
              className="ml-2 size-6 relative top-[7px] transition opacity-70 hover:opacity-100"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="icon icon-edit-url text-lg"/>
            </button>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <ListLoading/>
      ) : groups.length ? (
        <>
          {groups.map(group => {
            return <GroupBlock key={`group_${group}`} group={group} metrics={grouping[group]}/>;
          })}
        </>
      ) : (
        <div className="border-primary border rounded-md p-8 text-center">
          <div>
            <Trans i18nKey="empty_list"/>
          </div>

          <div className="">
            <button
              type="button"
              className="leading-6 underline hover:no-underline"
              onClick={() => setIsModalOpen(true)}
            >
              <Trans i18nKey="edit_metrics_url"/>
            </button>
          </div>
        </div>
      )}

      <ModalMetricsUrl
        isOpen={isModalOpen}
        onDismiss={() => setIsModalOpen(false)}
        credentials={metricCredentials}
        onSuccess={onSuccess}
      />
    </div>
  );
}
