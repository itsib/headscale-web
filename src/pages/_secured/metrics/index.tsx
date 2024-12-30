import { createFileRoute, redirect } from '@tanstack/react-router';
import { getCredentials } from '../../../utils/credentials.ts';

export const Route = createFileRoute('/_secured/metrics/')({
  beforeLoad: async ({ location, context }) => {
    const { base } = await getCredentials(context.storage, 'metric');
    if (location.pathname === '/metrics') {
      if (base) {
        throw redirect({ to: '/metrics/formatted', replace: true });
      } else {
        throw redirect({ to: '/metrics/credentials', replace: true });
      }
    }
  },
});
