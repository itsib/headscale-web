import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/metrics/_tabs/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Navigate to="/metrics/formatted" />;
}
