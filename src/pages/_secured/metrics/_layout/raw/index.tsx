import { createFileRoute, getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

export const Route = createFileRoute('/_secured/metrics/_layout/raw/')({
  component: RouteComponent,
});

function RouteComponent() {
  const routeApi = getRouteApi('/_secured/metrics/_layout');
  const raw = routeApi.useLoaderData() as string;

  const strings = useMemo(() => raw ? raw.split('\n') : [], [raw]);

  return (
    <div className="whitespace-pre-wrap">
      {strings.map((str, i) => {
        if (str.startsWith('# HELP')) {
          return <div key={i} className="mt-4">{str}</div>;
        } else if (str.startsWith('# TYPE')) {
          return <div key={i} className="mb-1">{str}</div>;
        } else {
          return <div key={i} className="text-secondary">{str}</div>;
        }
      })}
    </div>
  );
}
