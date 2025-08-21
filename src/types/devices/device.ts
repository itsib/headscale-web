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
  /**
   * Tags sets via CLI
   */
  forcedTags: string[];
  /**
   * Valid tags are tags added by a user
   * that is allowed in the ACL policy to add this tag.
   */
  validTags: string[];
  /**
   * Invalid tags are tags added by a user
   * on a node, and that user doesn't have
   * authority to add this tag.
   */
  invalidTags: string[];
  online: boolean;
  approvedRoutes: string[];
  availableRoutes: string[];
  subnetRoutes: string[];
  createdAt: string;
}
