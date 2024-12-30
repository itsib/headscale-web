import { createFileRoute, getRouteApi } from '@tanstack/react-router';

export const Route = createFileRoute('/_secured/metrics/_layout/raw/')({
  component: RouteComponent,
});

function RouteComponent() {
  const routeApi = getRouteApi('/_secured/metrics/_layout');
  const { metrics: raw } = routeApi.useLoaderData() as {
    metrics: string | null;
    base: string | null;
  };

  return <div className="whitespace-pre-wrap">{raw}</div>;
}
