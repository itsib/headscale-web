import { User } from '../users/users.ts';

export type DeviceRegisterMethod = 'REGISTER_METHOD_CLI' | 'REGISTER_METHOD_OIDC';

export interface Device {
  id: string;
  name: string;
  givenName: string;
  ipAddresses: string[];
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
  registerMethod: DeviceRegisterMethod;
  nodeKey: string;
  discoKey: string;
  machineKey: string;
  preAuthKey?: string;
  user: User;
  createdAt: string;
  expiry: string;
  lastSeen: string;
}