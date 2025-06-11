import type { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { useRoute, useLocation } from 'preact-iso';
import { useDevice } from '@app-hooks/use-device.ts';
import { useLog } from '@app-hooks/use-log.ts';
import { useTranslation } from 'react-i18next';
import { DeviceLoading } from '@app-components/skeleton/device-loading';
import { PageCaption } from '@app-components/page-caption/page-caption';
import { DeviceOwner } from './_device-owner';
import { DeviceRoutes } from './_device-routes';
import { AclTags } from './_acl-tags.tsx';
import './device.css';
import { ModalNodeExpire } from '@app-components/modals/modal-node-expire/modal-node-expire.tsx';
import { ModalNodeDelete } from '@app-components/modals/modal-node-delete/modal-node-delete.tsx';
import { FormattedDate } from '@app-components/formatters/formatted-date.tsx';
import { Marker } from '@app-components/marker/marker.tsx';

export const DevicePage: FunctionComponent = () => {
  const { params } = useRoute();
  const { route } = useLocation();
  const { t } = useTranslation();
  const { data: device, isLoading } = useDevice(params.id);

  const [isOpenExpiry, setIsOpenExpiry] = useState<boolean>(false);
  const [isOpenRemove, setIsOpenRemove] = useState<boolean>(false);

  useLog({ device });

  return (
    <>
      {isLoading ? (
        <div className="page device-page">
          <DeviceLoading />
        </div>
      ) : device ? (
        <div className="page device-page">
          <PageCaption
            title={
              <>
                {t('device_with_name', { name: device.givenName || device.name })}
                <Marker isActive size={12} className="is-online" />
              </>
            }
            subtitle={<a href="/devices" className="back-url">{t('back_to_devices_list')}</a>}
          />

          <hr />

          <div className="main-content content">
            <div className="">
              <DeviceOwner deviceId={device.id} user={device.user} />

              <AclTags deviceId={device.id} validTags={device.validTags} forcedTags={device.forcedTags} invalidTags={device.invalidTags} />

              <div className="meta-data">
                <span className="label">{t('created_at')}</span>
                <FormattedDate date={device.createdAt} />
              </div>
              <div className="meta-data">
                <span className="label">{t('last_seen')}</span>
                <FormattedDate date={device.lastSeen} />
              </div>
              <div className="meta-data">
                <span className="label">{t('expiry')}</span>
                <FormattedDate date={device.expiry} />
              </div>
            </div>

            <div className="">
              <div className="">
                <h3 className="title">{t('ip_addresses')}</h3>
                <div className="sub-title">{t('ip_addresses_summary')}</div>
                <div className="ip-addresses">
                  <div>{device.ipAddresses.map((ip) => (<span className="ip-address">{ip}</span>))}</div>
                </div>
              </div>

              <hr />

              <DeviceRoutes id={device.id} approvedRoutes={device.approvedRoutes} availableRoutes={device.availableRoutes} subnetRoutes={device.subnetRoutes} />
            </div>
          </div>

          <hr />

          <div className="danger-content content">
            <h3 className="title">{t('danger_zone')}</h3>

            <div className="space-between">
              <div>{t('expire_key_summary')}</div>

              <button type="button" className="btn btn-outline-danger" onClick={() => setIsOpenExpiry(true)}>{t('expire_key')}</button>
            </div>
            <div className="space-between">
              <div>{t('removing_device_summary')}</div>

              <button type="button" className="btn btn-danger" onClick={() => setIsOpenRemove(true)}>{t('delete_device')}</button>
            </div>
          </div>

          <ModalNodeExpire
            node={device}
            isOpen={isOpenExpiry}
            onDismiss={() => setIsOpenExpiry(false)}
            onSuccess={() => {}}
          />

          <ModalNodeDelete
            node={device}
            isOpen={isOpenRemove}
            onDismiss={() => setIsOpenRemove(false)}
            onSuccess={() => route('/devices', true)}
          />
        </div>
      ) : null}
    </>
  );
}