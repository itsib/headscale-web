import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    if (context.isAuthorized) {
      throw redirect({ to: '/machines' });
    } else {
      throw redirect({ to: '/home' });
    }
  }
});

