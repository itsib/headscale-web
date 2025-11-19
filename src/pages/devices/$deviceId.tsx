import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { DeviceLoading } from '@app-components/skeleton/device-loading.tsx';
import { PageCaption } from '@app-components/page-caption/page-caption.tsx';
import { DeviceName } from './-device-name.tsx';
import { DeviceOwner } from './-device-owner.tsx';
import { AclTags } from './-acl-tags.tsx';
import { FormattedDate } from '@app-components/formatters/formatted-date.tsx';
import { DeviceRoutes } from './-device-routes.tsx';
import { ModalNodeExpire } from '@app-components/modals/modal-node-expire/modal-node-expire.tsx';
import { ModalNodeDelete } from '@app-components/modals/modal-node-delete/modal-node-delete.tsx';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Device } from '@app-types';
import './$deviceId.css';

export const Route = createFileRoute('/devices/$deviceId')({
  beforeLoad: ({ params, context }) => ({
    queryOptions: queryOptions<{ node: Device }, Error, Device>({
      queryKey: [`/api/v1/node/${params.deviceId}`],
      select: (data) => data.node,
    }),
    client: context.client,
  }),
  loader: ({ context }) => {
    return context.client.ensureQueryData(context.queryOptions);
  },
  component: RouteComponent,
  pendingComponent: DeviceLoading,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { queryOptions } = Route.useRouteContext();

  const { t } = useTranslation();
  const { data: device } = useSuspenseQuery(queryOptions);

  const [isOpenExpiry, setIsOpenExpiry] = useState<boolean>(false);
  const [isOpenRemove, setIsOpenRemove] = useState<boolean>(false);

  return (
    <div className="page device-page">
      <PageCaption
        title={
          <>
            {t('device_with_name', { name: device.givenName || device.name })}
            {device.online ? (
              <sup className="badge online">ONLINE</sup>
            ) : (
              <sup className="badge offline">OFFLINE</sup>
            )}
          </>
        }
        subtitle={
          <Link to="/devices" className="back-url">
            {t('back_to_devices_list')}
          </Link>
        }
      />

      <hr />

      <div className="main-content content">
        <div className="">
          <h3 className="title">{t('manage_device')}</h3>

          <DeviceName deviceId={device.id} name={device.givenName || device.name} />

          <DeviceOwner deviceId={device.id} user={device.user} />

          <AclTags
            deviceId={device.id}
            validTags={device.validTags}
            forcedTags={device.forcedTags}
            invalidTags={device.invalidTags}
          />

          <div className="meta-data">
            <span className="label">{t('created_at')}:</span>
            <FormattedDate className="value" date={device.createdAt} />
            <span className="label">{t('last_seen')}:</span>
            <FormattedDate className="value" date={device.lastSeen} />
            <span className="label">{t('expiry')}:</span>
            <FormattedDate className="value" date={device.expiry} />
          </div>
        </div>

        <div className="">
          <div className="">
            <h3 className="title">{t('ip_addresses')}</h3>
            <div className="sub-title">{t('ip_addresses_summary')}</div>
            <div className="ip-addresses">
              <div>
                {device.ipAddresses.map((ip) => (
                  <span key={ip} className="ip-address">
                    {ip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <hr />

          <DeviceRoutes
            id={device.id}
            approvedRoutes={device.approvedRoutes}
            availableRoutes={device.availableRoutes}
            subnetRoutes={device.subnetRoutes}
          />
        </div>
      </div>

      <hr style={{ marginBottom: '4rem' }} />

      <div className="danger-content content">
        <h3 className="title">{t('danger_zone')}</h3>

        <div className="space-between">
          <div>{t('expire_key_summary')}</div>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => setIsOpenExpiry(true)}
          >
            {t('expire_key')}
          </button>
        </div>

        <hr />

        <div className="space-between">
          <div>{t('removing_device_summary')}</div>

          <button type="button" className="btn btn-danger" onClick={() => setIsOpenRemove(true)}>
            {t('delete_device')}
          </button>
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
        onSuccess={() => navigate({ to: '/devices', replace: true })}
      />
    </div>
  );
}
