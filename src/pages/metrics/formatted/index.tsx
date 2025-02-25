import { useMemo } from 'preact/hooks';
import { Metric } from '@app-types';
import { parseMetrics } from '@app-utils/parse-metrics.ts';
import { GroupBlock } from './-group-block.tsx';
import { Trans } from 'react-i18next';
import { RenderableProps } from 'preact';


export function Formatted(props: RenderableProps<{ metrics?: string; refetch: () => void }>) {
  const { metrics: rawMetrics } = props;

  const grouping = useMemo(() => {
    if (!rawMetrics) {
      return {};
    }
    const metrics = parseMetrics(rawMetrics);

    const grouping: { [system: string]: Metric[] } = {};

    for (let i = 0; i < metrics.length; i++) {
      const metric = metrics[i];

      grouping[metric.system] = grouping[metric.system] || [];
      grouping[metric.system].push(metric);
    }
    return grouping;
  }, [rawMetrics]);

  const systems = useMemo(() => Object.keys(grouping).sort(), [grouping]);

  return (
    <div>
      {systems.length ? (
        <>
          {systems.map((system) => {
            return (
              <GroupBlock
                key={`system_${system}`}
                group={system}
                metrics={grouping[system]}
              />
            );
          })}
        </>
      ) : (
        <div className="border-primary border rounded-md p-8 text-center">
          <div>
            <Trans i18nKey="empty_list" />
          </div>
        </div>
      )}
    </div>
  );
}
