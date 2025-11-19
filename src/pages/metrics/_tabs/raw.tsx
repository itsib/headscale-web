import { createFileRoute } from '@tanstack/react-router';
import { useContext, useMemo } from 'react';
import { MetricsPageContext } from '../_tabs.tsx';

export const Route = createFileRoute('/metrics/_tabs/raw')({
  component: RouteComponent,
});

function RouteComponent() {
  const metrics = useContext(MetricsPageContext);
  const strings = useMemo(() => metrics.split('\n'), [metrics]);

  return (
    <div className="whitespace-pre-wrap">
      {strings.map((str, i) => {
        if (str.startsWith('# HELP')) {
          return (
            <div key={i} className="mt-4">
              {str}
            </div>
          );
        } else if (str.startsWith('# TYPE')) {
          return (
            <div key={i} className="mb-1">
              {str}
            </div>
          );
        } else {
          return (
            <div key={i} className="text-secondary">
              {str}
            </div>
          );
        }
      })}
    </div>
  );
}
