import { DeviceRoute } from '@app-types';

export function isExitNodeRoute(route: DeviceRoute): boolean {
  return route.prefix === '::/0' || route.prefix === '0.0.0.0/0';
}