import { User } from '../users/users.ts';

export type DeviceRegisterMethod =
  | 'REGISTER_METHOD_CLI'
  | 'REGISTER_METHOD_OIDC'
  | 'REGISTER_METHOD_UNSPECIFIED'
  | 'REGISTER_METHOD_AUTH_KEY';

export interface Device {
  id: string;
  machineKey: string;
  nodeKey: string;
  discoKey: string;
  ipAddresses: string[];
  name: string;
  user: User;
  lastSeen: string;
  expiry: string;
  givenName: string;
  preAuthKey?: string;
  /**
   * Device registration method
   *
   * @default 'REGISTER_METHOD_UNSPECIFIED'
   */
  registerMethod: DeviceRegisterMethod;
  tags: string[];
  online: boolean;
  approvedRoutes: string[];
  availableRoutes: string[];
  subnetRoutes: string[];
  createdAt: string;
}
