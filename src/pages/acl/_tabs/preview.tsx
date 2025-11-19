import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/acl/_tabs/preview')({
  component: RouteComponent,
});

function RouteComponent() {
  const data = Route.parentRoute.useLoaderData();

  useEffect(() => {
    // data
  }, [data]);

  return (
    <div className="tabs-content ui-scroll">
      <div style={{ maxHeight: 'calc(100vh-380px)' }} className="p-4 overflow-y-auto">
        In development
      </div>
    </div>
  );
}
