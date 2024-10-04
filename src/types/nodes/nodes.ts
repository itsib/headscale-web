import { User } from '../users/users.ts';

export type NodeRegisterMethod = 'REGISTER_METHOD_CLI' | 'REGISTER_METHOD_OIDC';

export interface Node {
  id: string;
  name: string;
  givenName: string;
  ipAddresses: string[];
  validTags: string[];
  forcedTags: string[];
  invalidTags: string[];
  online: boolean;
  registerMethod: NodeRegisterMethod;
  nodeKey: string;
  discoKey: string;
  machineKey: string;
  preAuthKey?: string;
  user: User;
  createdAt: string;
  expiry: string;
  lastSeen: string;
}