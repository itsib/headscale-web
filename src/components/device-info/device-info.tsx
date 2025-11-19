import type { FC } from 'react';
import { Device } from '@app-types';
import { useTranslation } from 'react-i18next';
import { FormattedDate } from '@app-components/formatters/formatted-date.tsx';

export interface DeviceInfoProps {
  device?: Device | null;
}

export const DeviceInfo: FC<DeviceInfoProps> = ({ device }) => {
  const { t } = useTranslation();

  return device ? (
    <div className="info-rows">
      <div className="property">ID:</div>
      <div>{device.id}</div>
      <div className="property">{t('name')}</div>
      <div>{device.name}</div>
      <div className="property">{t('given_name')}</div>
      <div>{device.givenName}</div>
      <div className="property">{t('ip_address')}</div>
      <div>{device.ipAddresses[0]}</div>
      <div className="property">{t('created_at')}</div>
      <div>
        <FormattedDate date={device.createdAt} />
      </div>
      <div className="property">{t('last_seen')}</div>
      <div>
        <FormattedDate date={device.lastSeen} />
      </div>
    </div>
  ) : null;
};
