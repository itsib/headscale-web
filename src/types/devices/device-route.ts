import { Device } from './device.ts';

export interface DeviceRoute {
  id: string;
  isPrimary: boolean;
  advertised: boolean;
  enabled: boolean;
  prefix: string;
  node: Device;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
}
