import { useMemo } from 'react';
import { RenderableProps } from 'preact';

export function Raw(props: RenderableProps<{ metrics?: string; refetch: () => void }>) {
  const { metrics: raw } = props;

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
