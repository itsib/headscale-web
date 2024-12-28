import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { getCredentials } from '../utils/credentials.ts';

export const Route = createFileRoute('/_secured')({
  beforeLoad: async ({ context }) => {
    return await getCredentials(context.storage, 'main').catch(() => {
      throw redirect({ to: '/home' });
    });
  },
  component: Outlet,
});
