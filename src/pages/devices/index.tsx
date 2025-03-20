import { Trans, useTranslation } from 'react-i18next';
import { useMemo, useState } from 'preact/hooks';
import { Device, DeviceAction } from '@app-types';
import { ModalNodeCreate } from '@app-components/modals/modal-node-create/modal-node-create';
import { fetchWithContext } from '@app-utils/query-fn';
import { ModalNodeRename } from '@app-components/modals/modal-node-rename/modal-node-rename';
import { ModalNodeChown } from '@app-components/modals/modal-node-chown/modal-node-chown';
import { ModalNodeDelete } from '@app-components/modals/modal-node-delete/modal-node-delete';
import { ModalNodeRoutes } from '@app-components/modals/modal-node-routes/modal-node-routes';
import { ModalNodeTags } from '@app-components/modals/modal-node-tags/modal-node-tags';
import { ModalNodeExpire } from '@app-components/modals/modal-node-expire/modal-node-expire';
import { useQuery } from '@tanstack/react-query';
import { useStorage } from '@app-hooks/use-storage';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group';
import { ListLoading } from '@app-components/skeleton/list-loading.tsx';
import { DevicesTable } from '@app-components/devices-table';
import { useBreakPoint } from '@app-hooks/use-break-point.ts';
import { DevicesCards } from '@app-components/devices-cards';

export function Devices() {
  const storage = useStorage();
  const { t } = useTranslation();
  const [opened, setOpened] = useState<DeviceAction | null>(null);
  const [selected, setSelected] = useState<Device | null>(null);

  const isMobile = useBreakPoint(992);
  const [_isListLayout, setIsListLayout] = useState(true);
  const isListLayout = !isMobile && _isListLayout;

  const { data: devices, isLoading, refetch } = useQuery({
    queryKey: ['/api/v1/node', 'GET'],
    queryFn: async ({ queryKey, signal }) => {
      const data = await fetchWithContext<{ nodes: Device[] }>(
        queryKey[0] as string,
        { signal },
        storage,
      );
      return data.nodes;
    },
    staleTime: 60_000 * 60,
    refetchInterval: 30_000,
  });

  const buttons: ButtonConfig[] = useMemo(() => {
    const buttons = isMobile ? [] : [
      {
        id: 'set-layout',
        icon: isListLayout ? 'icon-layout-cards' : 'icon-layout-list',
        tooltip: t('layout_change'),
        effect: 'icon-flip', //'',
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
  }, [t, isMobile, isListLayout]);

  async function onClick(id: string) {
    switch (id) {
      case 'register-device':
        return setOpened('create');
      case 'refresh-devices':
        return refetch();
      case 'set-layout':
        return setIsListLayout(value => !value);
    }
  }

  return (
    <div className="pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="devices"/>
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="machines_page_subtitle"/>
          </p>
        </div>

        <ButtonGroup buttons={buttons} onClick={onClick}/>
      </div>

      {isLoading ? (
        <ListLoading/>
      ) : devices && devices?.length ? (
        <>
          {isListLayout ? (
            <DevicesTable devices={devices} onDevicesChange={setSelected} onAction={setOpened} />
          ) : (
            <DevicesCards devices={devices} onDevicesChange={setSelected} onAction={setOpened} />
          )}
        </>
      ) : (
        <div className="border-primary border rounded-md p-8 text-center">
          <Trans i18nKey="empty_list"/>
        </div>
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

