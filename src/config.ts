import type { SelectOption } from 'react-just-ui';

export const METRICS_TOKEN_TYPES: SelectOption[] = [
  {
    value: 'Bearer',
    label: 'Bearer/JWT Token',
    icon: 'icon icon-jwt'
  },
  {
    value: 'apiKey',
    label: 'API Access Key',
    icon: 'icon icon-api'
  },
];