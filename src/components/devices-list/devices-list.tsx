import { FunctionComponent } from 'preact';
import { Device } from '@app-types';
import { useTranslation } from 'react-i18next';
import { DeviceTableRow } from './_device-table-row';
import { DeviceCard } from './_device-card';
import './devices-list.css';

export interface DevicesProps {
  layout: 'table' | 'cards';
  devices: Device[];
}

export const DevicesList: FunctionComponent<DevicesProps> = ({ devices, layout }) => {
  const { t } = useTranslation();

  return (
    <div className="devices-list">
      {layout === 'table' ? (
        <table className="table-layout">
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">{t('device')}</th>
              <th scope="col">{t('user')}</th>
              <th scope="col">{t('tags')}</th>
              <th scope="col">{t('address')}</th>
              <th scope="col">{t('last_seen')}</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <DeviceTableRow key={device.id} {...device} />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="cards-layout">
          {devices.map((device: Device) => (
            <DeviceCard key={device.id} {...device} />
          ))}
        </div>
      )}
    </div>
  );
};
