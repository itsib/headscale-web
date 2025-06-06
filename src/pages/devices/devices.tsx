import { Trans, useTranslation } from 'react-i18next';
import { useMemo, useState, useCallback } from 'preact/hooks';
import { Device, DeviceAction, ListLayout } from '@app-types';
import { ModalNodeCreate } from '@app-components/modals/modal-node-create/modal-node-create';
import { ModalNodeRename } from '@app-components/modals/modal-node-rename/modal-node-rename';
import { ModalNodeChown } from '@app-components/modals/modal-node-chown/modal-node-chown';
import { ModalNodeDelete } from '@app-components/modals/modal-node-delete/modal-node-delete';
import { ModalNodeRoutes } from '@app-components/modals/modal-node-routes/modal-node-routes';
import { ModalNodeTags } from '@app-components/modals/modal-node-tags/modal-node-tags';
import { ModalNodeExpire } from '@app-components/modals/modal-node-expire/modal-node-expire';
import { useQuery } from '@tanstack/react-query';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { useBreakPoint } from '@app-hooks/use-break-point.ts';
import { EmptyList } from '@app-components/empty-list/empty-list';
import { DevicesList } from '@app-components/devices-list';
import './devices.css';

export function Devices() {
  const { t } = useTranslation();
  const [opened, setOpened] = useState<DeviceAction | null>(null);
  const [selected, setSelected] = useState<Device | null>(null);

  const isMobile = useBreakPoint(992);
  const [_isTableLayout, setIsTableLayout] = useState(true);
  const isTableLayout = !isMobile && _isTableLayout;
  const layout: ListLayout = isTableLayout ? 'table' : 'cards';

  const { data: devices, isLoading, refetch } = useQuery<{ nodes: Device[] }, Error, Device[]>({
    queryKey: ['/api/v1/node', 'GET'],
    select: data => data.nodes,
    staleTime: 60_000 * 60,
    refetchInterval: 30_001,
  });

  const buttons: ButtonConfig[] = useMemo(() => {
    const buttons = isMobile ? [] : [
      {
        id: 'set-layout',
        icon: isTableLayout ? 'icon-layout-cards' : 'icon-layout-list',
        tooltip: t('layout_change'),
        effect: 'icon-shake',
      },
    ];

    return [
      ...buttons,
      {
        id: 'refresh-devices',
        icon: 'icon-refresh',
        tooltip: t('refresh_devices'),
        effect: 'icon-spin',
      },
      {
        id: 'register-device',
        icon: 'icon-add-device',
        tooltip: t('register_device'),
        effect: 'icon-shake',
      },
    ];
  }, [t, isMobile, isTableLayout]);

  const onClick = useCallback((id: string) => {
    switch (id) {
      case 'register-device':
        return setOpened('create');
      case 'refresh-devices':
        return refetch({ cancelRefetch: true });
      case 'set-layout':
        return setIsTableLayout(value => !value);
    }
  }, []);

  return (
    <div className="devices-page">
      <div className="caption">
        <div className="">
          <h1 className="mb-2">
            <Trans i18nKey="devices"/>
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="machines_page_subtitle"/>
          </p>
        </div>

        <div className="actions">
          <ButtonGroup buttons={buttons} onClick={onClick}/>
        </div>
      </div>

      {isLoading ? (
        <ListLoading />
      ) : devices && devices?.length ? (
        <DevicesList layout={layout} devices={devices} onChange={setSelected} onAction={setOpened} />
      ) : (
        <EmptyList />
      )}

      <div className="h-[40px]" />

      <ModalNodeCreate
        isOpen={opened === 'create'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeRename
        node={selected}
        isOpen={opened === 'rename'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeChown
        node={selected}
        isOpen={opened === 'chown'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeDelete
        node={selected}
        isOpen={opened === 'delete'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeRoutes
        node={selected}
        isOpen={opened === 'routes'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeTags
        node={selected}
        isOpen={opened === 'tags'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalNodeExpire
        node={selected}
        isOpen={opened === 'expiry'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

