import { FunctionComponent } from 'preact';
import { useTranslation } from 'react-i18next';
import { Device, ContextMenuBase, DeviceAction } from '@app-types';
import { DeviceItem } from './_device-item';
import './devices-table.css';

export interface DevicesTableProps extends ContextMenuBase<DeviceAction> {
  devices: Device[];
  onDevicesChange: (device: Device) => void;
}

export const DevicesTable: FunctionComponent<DevicesTableProps> = ({ devices, onAction, onDevicesChange }) => {
  const { t } = useTranslation();

  return (
    <table className="devices-table">
      <thead>
        <tr>
          <th scope="col" />
          <th scope="col">{t('device')}</th>
          <th scope="col">{t('user')}</th>
          <th scope="col">{t('tags')}</th>
          <th scope="col">{t('address')}</th>
          <th scope="col">{t('last_seen')}</th>
          <th scope="col" />
        </tr>
      </thead>
      <tbody>
      {devices.map((device) => (
        <DeviceItem
          key={device.id}
          onAction={action => {
            onAction(action);
            onDevicesChange(device);
          }}
          {...device}
        />
      ))}
      </tbody>
    </table>
  );
};