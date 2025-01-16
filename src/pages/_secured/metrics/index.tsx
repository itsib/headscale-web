import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_secured/metrics/')({
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/metrics') {
      throw redirect({ to: '/metrics/formatted', replace: true });
    }
  },
});
