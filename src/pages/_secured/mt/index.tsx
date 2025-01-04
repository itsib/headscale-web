import { createFileRoute, redirect } from '@tanstack/react-router';
import { getCredentials } from '../../../utils/credentials.ts';

export const Route = createFileRoute('/_secured/mt/')({
  beforeLoad: async ({ location, context }) => {
    const { base } = await getCredentials(context.storage, 'metric');
    if (location.pathname === '/mt') {
      if (base) {
        throw redirect({ to: '/mt/formatted', replace: true });
      } else {
        throw redirect({ to: '/mt/credentials', replace: true });
      }
    }
  },
});
