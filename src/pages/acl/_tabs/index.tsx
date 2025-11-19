import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/acl/_tabs/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Navigate to="/acl/edit-file" />;
}
