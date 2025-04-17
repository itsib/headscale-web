import { FunctionComponent } from 'preact';
import { DeviceRoute } from '@app-types';
import { cn } from 'react-just-ui/utils/cn';
import { useNodeRoutes } from '@app-hooks/use-node-routes';
import { useEffect, useState } from 'preact/hooks';
import { isExitNodeRoute } from '@app-utils/is-exit-node-route.ts';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'react-just-ui/checkbox';
import { useMutation } from '@tanstack/react-query';
import { fetchFn } from '@app-utils/query-fn.ts';
import { useNotifyQuery } from '@app-hooks/use-notify-query.ts';
import './_device-routes.css';

interface RequestData {
  enable: boolean;
  routeId: string;
}

export interface DeviceRoutesProps {
  deviceId: string;
  className?: string;
}

export const DeviceRoutes: FunctionComponent<DeviceRoutesProps> = ({ deviceId, className }) => {
  const { t } = useTranslation();
  const { start, success, error } = useNotifyQuery();
  const { data: routes } = useNodeRoutes(deviceId);

  const [exitNodeRoute, setExitNodeRoute] = useState<DeviceRoute | null>(null);
  const [deviceRoutes, setDeviceRoutes] = useState<DeviceRoute[] | null>(null);

  const { mutate } = useMutation({
    mutationFn: ({ enable, routeId }: RequestData) => {
      return fetchFn(`/api/v1/routes/${routeId}/${enable ? 'enable' : 'disable'}`, {
        method: 'POST',
      });
    },
    onMutate: () => start(),
    onSuccess: () => success(),
    onError: (e: any, { enable, routeId }: RequestData) => {
      if (!deviceRoutes) return;

      for (let i = 0; i < deviceRoutes!.length; i++) {
        if (deviceRoutes[i].id === routeId) {
          deviceRoutes[i] = { ...deviceRoutes[i], enabled: !enable };
          break;
        }
      }
      setDeviceRoutes([...deviceRoutes]);

      error(e.message)
    },
  })

  // Compute exit node checkbox state
  useEffect(() => {
    if (!routes) return;

    const deviceRoutes: DeviceRoute[] = [];

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (isExitNodeRoute(route)) {
        setExitNodeRoute(route);
      } else {
        deviceRoutes.push(route);
      }
    }
    setDeviceRoutes(deviceRoutes);

  }, [routes]);

  return (
    <div className={cn('device-routes', className)}>
      <h3 className="title">{t('subnet_routes')}</h3>
      <div className="sub-title">{t('subnet_routes_summary')}</div>

      {deviceRoutes?.length ? (
        <div className="routes-checkboxes">
          {deviceRoutes.map(route => (
            <Checkbox
              key={route.id}
              id={`route-enable-${route.id}`}
              className="route-checkbox"
              label={route.prefix}
              checked={route.enabled}
              size={20}
              onChange={e => {
                const checked = !!(e.target as any).checked;

                mutate({ routeId: route.id, enable: checked });

                for (let i = 0; i < deviceRoutes!.length; i++) {
                  if (deviceRoutes[i].id === route.id) {
                    deviceRoutes[i] = { ...route, enabled: checked };
                    break;
                  }
                }
                setDeviceRoutes([...deviceRoutes]);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="no-routes">
          {t('no_subnet_routes')}
        </div>
      )}

      <hr />

      <h3 className="title">{t('exit_node')}</h3>
      <div className="sub-title">{t('exit_node_subtitle')}</div>

      <div className="routes-checkboxes">
        <Checkbox
          id="enable-exit-node"
          className="route-checkbox"
          label={t('use_as_exit_node')}
          checked={!!exitNodeRoute?.enabled}
          size={20}
          disabled={!exitNodeRoute}
          onChange={e => {
            if (!exitNodeRoute) return;

            mutate({ routeId: exitNodeRoute.id, enable: !!(e.target as any).checked });
            setExitNodeRoute({ ...exitNodeRoute, enabled: !!(e.target as any).checked });
          }}
        />
      </div>
    </div>
  );
};