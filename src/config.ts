import type { SelectOption } from 'react-just-ui';

export const REFRESH_INTERVAL = 20_000;

export const DEFAULT_ACL_POLICY = JSON.stringify({
  acls: [{
    action: 'accept',
    src: ['*'],
    dst: ['*:*'],
  }],
});

export const IDB_VERSION = 8;

export const METRICS_TOKEN_TYPES: SelectOption[] = [
  {
    value: 'Bearer',
    label: 'Bearer/JWT Token',
    icon: 'icon icon-jwt',
  },
  {
    value: 'apiKey',
    label: 'API Access Key',
    icon: 'icon icon-api',
  },
];
