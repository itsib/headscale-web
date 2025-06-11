import { useTranslation } from 'react-i18next';
import { useMemo, useState, useCallback } from 'preact/hooks';
import { Device, ListLayout } from '@app-types';
import { ModalNodeCreate } from '@app-components/modals/modal-node-create/modal-node-create';
import { useQuery } from '@tanstack/react-query';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { useBreakPoint } from '@app-hooks/use-break-point.ts';
import { EmptyList } from '@app-components/empty-list/empty-list';
import { DevicesList } from '@app-components/devices-list';
import { PageCaption } from '@app-components/page-caption/page-caption.tsx';
import './devices.css';

export function DevicesPage() {
  const { t } = useTranslation();
  const [isOpened, setIsOpened] = useState(false);

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
        return setIsOpened(true);
      case 'refresh-devices':
        return refetch({ cancelRefetch: true });
      case 'set-layout':
        return setIsTableLayout(value => !value);
    }
  }, []);

  return (
    <div className="page devices-page">
      <PageCaption
        title="devices"
        subtitle="machines_page_subtitle"
        actions={<ButtonGroup buttons={buttons} onClick={onClick}/>}
      />

      {isLoading ? (
        <ListLoading />
      ) : devices && devices?.length ? (
        <DevicesList layout={layout} devices={devices} />
      ) : (
        <EmptyList />
      )}

      <div className="h-[40px]" />

      <ModalNodeCreate
        isOpen={isOpened}
        onDismiss={() => setIsOpened(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

