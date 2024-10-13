import { Node } from './nodes'

export interface NodeRoute {
  id: string;
  isPrimary: boolean;
  advertised: boolean;
  enabled: boolean;
  prefix: string;
  node: Node;
  updatedAt: string;
  createdAt: string;
  deletedAt?: string | null;
}