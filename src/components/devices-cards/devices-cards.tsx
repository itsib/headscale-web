import { FunctionComponent } from 'preact';
import { ContextMenuBase, Device, DeviceAction } from '@app-types';
import { DeviceItem } from './_device-item';
import './devices-cards.css';

export interface DevicesCardsProps  extends ContextMenuBase<DeviceAction> {
  devices: Device[];
  onDevicesChange: (device: Device) => void;
}

export const DevicesCards: FunctionComponent<DevicesCardsProps> = ({ devices, onDevicesChange, onAction }) => {
  return (
    <div className="devices-cards">
      {devices.map((device: Device) => (
        <DeviceItem
          key={device.id}
          onAction={action => {
            onAction(action);
            onDevicesChange(device);
          }}
          {...device}
        />
      ))}
    </div>
  );
}