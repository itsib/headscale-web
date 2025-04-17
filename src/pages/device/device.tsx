import { FunctionComponent } from 'preact';
import { useRoute } from 'preact-iso';
import { useDevice } from '@app-hooks/use-device.ts';
import { useLog } from '@app-hooks/use-log.ts';
import { useTranslation } from 'react-i18next';
import { DeviceLoading } from '@app-components/skeleton/device-loading';
import { PageCaption } from '@app-components/page-caption/page-caption';
import { DeviceOwner } from './_device-owner';
import { DeviceRoutes } from './_device-routes';
import './device.css';

export const DevicePage: FunctionComponent = () => {
  const { params } = useRoute();
  const { t } = useTranslation();
  const { data: device, isLoading } = useDevice(params.id);

  useLog({ device });

  return isLoading ? (
    <div className="page device-page">
      <DeviceLoading />
    </div>
    ) : device ? (
    <div className="page device-page">

      <PageCaption
        title={
          <>
            {t('device_with_name', { name: device.givenName || device.name })}
          </>
        }
        subtitle={<a href="/devices" className="back-url">{t('back_to_devices_list')}</a>}
      />

      <hr />

      <div>

      </div>

      <div className="content">

        <div className="">
          <DeviceOwner deviceId={device.id} userName={device.user.name} />
        </div>

        <div className="">
          <DeviceRoutes deviceId={device.id} />
        </div>

      </div>

      {/*<div className="name-actions-block">*/}
      {/*  <div className="">*/}
      {/*    <span>{device.givenName || device.name}</span>*/}
      {/*    <Marker isActive={device.online} className="online" />*/}
      {/*  </div>*/}
      {/*</div>*/}

      <div>

      </div>
    </div>
  ) : null;
}