import { NodeRoute } from '@app-types';

export function isExitNodeRoute(route: NodeRoute): boolean {
  return route.prefix === '::/0' || route.prefix === '0.0.0.0/0';
}