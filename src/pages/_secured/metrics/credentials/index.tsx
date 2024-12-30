import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_secured/metrics/credentials/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_secured/metrics/credentials/"!</div>;
}
