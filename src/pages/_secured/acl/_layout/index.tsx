import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_secured/acl/_layout/')({
  beforeLoad: () => {
    throw redirect({ to: '/acl/edit-file', replace: true });
  },
});
