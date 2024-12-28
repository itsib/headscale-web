import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_secured/acl/_layout/preview')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="tabs-content jj-scroll">
      <div className="px-6 py-8">In Development</div>
    </div>
  );
}
