import { FunctionComponent } from 'preact';
import { Device } from '@app-types';
import { cn } from 'react-just-ui/utils/cn';
import { useEffect, useState } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'react-just-ui/checkbox';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFn } from '@app-utils/query-fn';
import { useNotifyQuery } from '@app-hooks/use-notify-query';
import { useCallback } from 'react';
import './_device-routes.css';

interface RequestData {
  routes: string[];
  id: string;
}

export interface DeviceRoutesProps {
  id: string;
  approvedRoutes: string[];
  availableRoutes: string[];
  subnetRoutes: string[];
  className?: string;
}

export const DeviceRoutes: FunctionComponent<DeviceRoutesProps> = ({
  id,
  approvedRoutes,
  availableRoutes,
  subnetRoutes,
  className,
}) => {
  const { t } = useTranslation();
  const { start, success, error } = useNotifyQuery();
  const queryClient = useQueryClient();

  const [hasExitNode, setHasExitNode] = useState(false);
  const [approvedExitNode, setApprovedExitNode] = useState(false);

  const [availableSubnetRoutes, setAvailableSubnetRoutes] = useState<string[]>(approvedRoutes);
  const [approvedSubnetRoutes, setApprovedSubnetRoutes] = useState<string[]>(approvedRoutes);

  const fillFormData = useCallback((available: string[], approved: string[]) => {
    setHasExitNode(available.includes('::/0') || available.includes('0.0.0.0/0'));
    setApprovedExitNode(approved.includes('::/0') || approved.includes('0.0.0.0/0'));

    setAvailableSubnetRoutes(
      available.filter((route) => route !== '::/0' && route !== '0.0.0.0/0')
    );
    setApprovedSubnetRoutes(approved.filter((route) => route !== '::/0' && route !== '0.0.0.0/0'));
  }, []);

  const { mutate } = useMutation({
    mutationFn: ({ routes, id }: RequestData) => {
      return fetchFn<{ node: Device }>(`/api/v1/node/${id}/approve_routes`, {
        method: 'POST',
        body: JSON.stringify({ routes }),
      });
    },
    onMutate: () => start(),
    onSuccess: (result) => {
      success();

      queryClient.setQueryData([`/api/v1/node/${id}`], result);
    },
    onError: (e: any) => {
      fillFormData(availableRoutes, approvedRoutes);

      error(e.message);
    },
  });

  // Compute exit node checkbox state
  useEffect(() => {
    fillFormData(availableRoutes, approvedRoutes);
  }, [availableRoutes, approvedRoutes, subnetRoutes]);

  return (
    <div className={cn('device-routes', className)}>
      <h3 className="title">{t('subnet_routes')}</h3>
      <div className="sub-title">{t('subnet_routes_summary')}</div>

      {availableSubnetRoutes.length ? (
        <div className="routes-checkboxes">
          {availableSubnetRoutes.map((route, index) => (
            <Checkbox
              key={route}
              id={`route-enable-${index}`}
              className="route-checkbox"
              label={route}
              checked={approvedSubnetRoutes.includes(route)}
              size={20}
              rowReverse={true}
              onChange={(e) => {
                const checked = !!(e.target as any).checked;

                const newApprovedSubnetRoutes = checked
                  ? [...approvedSubnetRoutes, route]
                  : approvedSubnetRoutes.filter((_route) => _route !== route);

                const routes: string[] = [
                  ...(approvedExitNode ? ['::/0', '0.0.0.0/0'] : []),
                  ...newApprovedSubnetRoutes,
                ];

                mutate({ id, routes });

                setApprovedSubnetRoutes(newApprovedSubnetRoutes);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="no-routes">{t('no_subnet_routes')}</div>
      )}

      <hr />

      <h3 className="title">{t('exit_node')}</h3>
      <div className="sub-title">{t('exit_node_subtitle')}</div>

      <div className="routes-checkboxes">
        <Checkbox
          id="enable-exit-node"
          className="route-checkbox"
          label={t('use_as_exit_node')}
          checked={approvedExitNode}
          size={20}
          disabled={!hasExitNode}
          onChange={(e) => {
            if (!hasExitNode) return;

            const checked = !!(e.target as any).checked;

            const routes: string[] = [
              ...(checked ? ['::/0', '0.0.0.0/0'] : []),
              ...approvedSubnetRoutes,
            ];

            mutate({ id, routes });

            setApprovedExitNode(checked);
          }}
        />
      </div>
    </div>
  );
};
