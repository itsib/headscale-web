import { FC, useMemo } from 'react';
import { Measure, MetricRowProps } from '../../../types';
import { formatNumbers } from '../../../utils/format-numbers.ts';

export const MetricItem: FC<MetricRowProps> = ({ id, description, data, type }) => {
  const title = id.replace(/_/g, ' ')
    .replace(/http/ig, 'HTTP')
    .replace(/cpu/ig, 'CPU')
    .replace(/fds/ig, 'file descriptors')
    .replace(/gomemlimit/ig, 'Go memory limit')
    .replace(/^(\w)/, (_match: string, first: string) => first.toUpperCase());

  const measure = useMemo(() => {
    const segments = id.split('_');
    let last = segments.pop();
    if (last === 'total') {
      last = segments.pop();
    }
    if (last && ['bytes', 'seconds', 'percent'].includes(last)) {
      return last as Measure;
    }

    return null;
  }, [id]);

  return (
    <div className="py-2 border-primary border-t flex justify-between items-start">
      <div className="text-base w-1/2">
        <div>{title}</div>
        <div className="text-xs text-secondary opacity-60">{description}</div>
      </div>

      <div className="text-right">
        <FormatStringData id={id} type={type} data={data} measure={measure}/>
      </div>
    </div>
  );
};

const FormatStringData: FC<{ data: any; type: string; id: string, measure?: Measure | null }> = ({ id, type, data, measure }) => {
  const formatted = useMemo(() => {
    if (typeof data === 'string' && data.startsWith('{')) {
      return <LabelValue label={data} measure={measure} />;
    } else if (typeof data === 'string') {
      return <LabelValue value={data} measure={measure} />;
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      const keys = Object.keys(data);
      if (keys.length === 1) {
        const [key] = keys;
        const label = key.split(id)[1]?.trim();
        return <LabelValue label={label} value={data[key]} measure={measure} />;
      }

      return keys.map(key => {
        return <LabelValue key={key} label={key.split(id)[1]} value={data[key]} measure={measure} />;
      });
    }

  }, [type, data]);

  return (
    <div className="grid grid-cols-[minmax(min-content,_1fr)_min-content] gap-x-2 gap-y-0.5">{formatted}</div>
  );
};

interface LabelValueProps {
  label?: string | null;
  value?: string | null;
  measure?: Measure | null;
}

const LabelValue: FC<LabelValueProps> = ({ label: _label, value, measure }) => {
  let label: string | undefined = _label || undefined;
  let parts: string[];
  if (label) {
    if (label.includes('{')) {
      [, ...parts] = label.split('{');

      parts = parts.join('{').split('}');
      parts.pop();
      label = parts.join('}');

    }

    if (label === '_sum') {
      label = 'Total'
    } else if (label === '_count') {
      label = 'Count'
    } else if (label) {
      label = label.split(',')
        .map(items => {
          const [valueA, valueB] = items.split('=');
          return `${valueA}: ${valueB.slice(1, -1)}`
        })
        .join(' ');
    }
  }
  value = value ? formatNumbers(value, measure) : value;

  [label, value] = value ? [label, value] : [undefined, label];
  return (
    <>
      <div className="text-sm text-secondary whitespace-nowrap text-right">{label}&nbsp;&nbsp;</div>
      <div className="text-sm whitespace-nowrap" data-measure={measure}>{value}</div>
    </>
  );
};