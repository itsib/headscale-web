import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_secured/mt/credentials/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_secured/mt/credentials/"!</div>;
}
