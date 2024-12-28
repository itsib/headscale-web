import { lazy } from 'react';

export const DevTools = !import.meta.env.DEV ? () => null : lazy(() =>
  import('@tanstack/router-devtools').then((res) => ({
    default: res.TanStackRouterDevtools,
  })),
)