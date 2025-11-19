import { createFileRoute } from '@tanstack/react-router';
import { MetricsTable } from '@app-components/metrics-table/metrics-table.tsx';
import { useContext } from 'react';
import { MetricsPageContext } from '../_tabs.tsx';

export const Route = createFileRoute('/metrics/_tabs/formatted')({
  component: RouteComponent,
});

function RouteComponent() {
  const metrics = useContext(MetricsPageContext);

  return (
    <div>
      <MetricsTable metrics={metrics} />
    </div>
  );
}
