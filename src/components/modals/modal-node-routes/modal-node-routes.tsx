import { Modal, ModalProps } from 'react-just-ui/modal';
import { Device } from '@app-types';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { ModalNodeExpireProps } from '../modal-node-expire/modal-node-expire.tsx';
import { Trans, useTranslation } from 'react-i18next';
import { useNodeRoutes } from '@app-hooks/use-node-routes';
import { Checkbox } from 'react-just-ui/checkbox';
import { useMutation } from '@tanstack/react-query';
import { fetchFn } from '@app-utils/query-fn.ts';
import { isExitNodeRoute } from '@app-utils/is-exit-node-route';
import { FunctionComponent } from 'preact';
import './modal-node-routes.css';

export interface ModalNodeRoutesProps extends ModalProps {
  node?: Device | null;
  onSuccess: () => void;
}

interface RequestData {
  enable: boolean;
  routeId: string;
}

export const ModalNodeRoutes: FunctionComponent<ModalNodeRoutesProps> = ({ isOpen, onDismiss, node, ...props }) => {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss}>
      {node ? <ModalContent onDismiss={onDismiss} node={node} {...props} /> : null}
    </Modal>
  );
};

const ModalContent: FunctionComponent<Omit<ModalNodeExpireProps, 'isOpen' | 'node'> & { node: Device }> = props => {
  const { t } = useTranslation();
  const [checkboxes, setCheckboxes] = useState<{ [routeId: string]: boolean }>({});
  const [exitNode, setExitNode] = useState(false);
  const [changed, setChanged] = useState(false);
  const { onDismiss, onSuccess, node } = props;

  const { data: routes, isLoading } = useNodeRoutes(node.id);

  const subnet = useMemo(() => {
    if(!routes) return undefined;
    return routes.filter(route => !isExitNodeRoute(route));
  }, [routes]);

  const exitRoutes = useMemo(() => routes ? routes.filter(isExitNodeRoute) : undefined, [routes]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: RequestData[]) => {
      return await Promise.all(variables.map(({ enable, routeId }) => {
        return fetchFn(`/api/v1/routes/${routeId}/${enable ? 'enable' : 'disable'}`, {
          method: 'POST',
        });
      }));
    },
    onSuccess: () => {
      onDismiss?.();
      onSuccess?.();
    },
  })

  function onSave() {
    if (!routes) return;
    const requestData: RequestData[] = [];

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (isExitNodeRoute(route)) {
        if (exitNode !== route.enabled) {
          requestData.push({ enable: exitNode, routeId: route.id });
        }
      } else {
        if (checkboxes[route.id] !== route.enabled) {
          requestData.push({ enable: checkboxes[route.id], routeId: route.id });
        }
      }
    }

    if (!requestData.length) return;

    mutate(requestData);
  }

  // Advertise routes state
  useEffect(() => {
    if (!subnet) {
      setCheckboxes({});
      return;
    }
    const state: { [routeId: string]: boolean } = {};
    for (let i = 0; i < subnet.length; i++) {
      state[subnet[i].id as any] = subnet[i].enabled;
    }
    setCheckboxes(state);
  }, [subnet]);

  // Compute exit node checkbox state
  useEffect(() => {
    if (!exitRoutes || !exitRoutes.length) {
      return setExitNode(false);
    }

    let enabled = true;
    for (let i = 0; i < exitRoutes.length; i++) {
      if (exitRoutes[i].prefix === '::/0' || exitRoutes[i].prefix === '0.0.0.0/0') {
        if (!exitRoutes[i].enabled) {
          enabled = false;
          break;
        }
      }
    }
    setExitNode(enabled);
  }, [exitRoutes]);

  return (
    <div className="modal modal-node-routes w-[400px]">
      <div className="modal-header">
        <div className="title">
          <span>{t('edit_route_settings_of', { name: node.givenName || node.name })}</span>
        </div>
        <button type="button" className="btn btn-close" onClick={() => onDismiss()}/>
      </div>
      <div className="modal-content">
        <h3 className="font-semibold mb-2 text-base">
          <Trans i18nKey="subnet_routes"/>
        </h3>
        <div className="text-secondary text-sm mb-2">
          <Trans i18nKey="subnet_routes_summary"/>
        </div>

        <div className="mb-3">
          {isLoading ? (
            <div>
              <div className="my-2 w-full h-[20px] rounded-sm bg-primary animate-pulse"/>
              <div className="my-2 w-[75%] h-[20px] rounded-sm bg-primary animate-pulse"/>
              <div className="my-2 w-[75%] h-[20px] rounded-sm bg-primary animate-pulse"/>
            </div>
          ) : subnet?.length ? (
            <div className="subnet-routes-block">
              {subnet.map(route => (
                <div key={route.id} className="subnet-route">
                  <Checkbox
                    id={`route-enable-${route.id}`}
                    label={<span className="text-primary">{route.prefix}</span>}
                    checked={!!checkboxes[route.id]}
                    size={16}
                    onChange={e => {
                      setCheckboxes(other => ({ ...other, [route.id]: (e.target as any).checked }));
                      setChanged(true);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="mt-2 border-primary border rounded-md text-center px-2 py-5 text-secondary text-sm bg-gray-600 bg-opacity-10">
              <Trans i18nKey="no_subnet_routes"/>
            </div>
          )}
        </div>

        <hr className="border-t-primary mb-3"/>

        <h3 className="font-semibold mb-2 text-base">
          <Trans i18nKey="exit_node"/>
        </h3>
        <div className="text-secondary text-sm">
          <Trans i18nKey="exit_node_subtitle"/>
        </div>

        <div className="exit-node-checkbox-wrap">
          <Checkbox
            id="enable-exit-node"
            className="exit-node-checkbox"
            label={<span className="text-primary">{t('use_as_exit_node')}</span>}
            checked={exitNode}
            size={16}
            disabled={!exitRoutes || exitRoutes.length === 0}
            onChange={e => {
              setExitNode((e.target as any).checked);
              setChanged(true);
            }}
          />
        </div>

        <div className="mt-4">
          <button type="button" className={`btn btn-accent w-full ${isPending ? 'loading' : ''}`} disabled={!changed || !routes} onClick={onSave}>
            <span><Trans i18nKey="save" /></span>
          </button>
        </div>
      </div>
    </div>
  );
};
