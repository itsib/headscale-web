import { FunctionComponent } from 'preact';
import { MetricsTable } from '@app-components/metrics-table/metrics-table.tsx';

export interface FormattedPageProps {
  metrics: string;
  refetch?: () => void;
}

export const FormattedPage: FunctionComponent<FormattedPageProps> = ({ metrics }) => {
  return (
    <div>
      <MetricsTable metrics={metrics} />
    </div>
  );
}
