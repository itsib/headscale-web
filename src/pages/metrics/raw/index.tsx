import { useMemo } from 'preact/hooks';
import { FunctionComponent } from 'preact';

export interface RawPageProps {
  metrics: string;
  refetch?: () => void;
}

export const RawPage: FunctionComponent<RawPageProps> = ({ metrics }) => {
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
};
