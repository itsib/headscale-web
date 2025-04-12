import { DataPoint, DataPointAttribute, MetricKind, MetricType, MetricUnit } from '../types';
import { Metric } from '../types';

const UNITS: MetricUnit[] = ['bytes', 'seconds', 'percent', 'requests', 'threads', 'objects'];

function formatName(name: string): string {
  return name
    .replace(/http/ig, 'HTTP')
    .replace(/cpu/ig, 'CPU')
    .replace(/fds/ig, 'file descriptors')
    .replace(/gomemlimit/ig, 'Go memory limit')
    .replace(/alloc/ig, 'allocation')
    .replace(/^(\w)/, (_match: string, first: string) => first.toUpperCase());
}

function parseMetricId(id: string): Pick<Metric, 'id' | 'system' | 'unit' | 'isTotal' | 'name'> {
  const [system, ...parts] = id.split('_');
  let isTotal = false;
  let unit: MetricUnit | undefined = undefined;

  if (parts[parts.length - 1] === 'total') {
    isTotal = true;
    parts.pop();
  }

  if (UNITS.includes(parts[parts.length - 1] as MetricUnit)) {
    if (parts.length === 1) {
      unit = parts[parts.length - 1] as MetricUnit;
    } else {
      unit = parts.pop() as MetricUnit;
    }
  }

  return {
    id: id,
    system: system,
    name: formatName(parts.join(' ')),
    isTotal: isTotal,
    unit: unit,
  }
}

function parseDataPoint(id: string, line: string, unit?: MetricUnit): DataPoint {
  const [dataWithId, value] = line.split(' ');
  const data = dataWithId.replace(id, '').trim();
  const attributes: DataPointAttribute[] = [];
  let kind: MetricKind = 'value';

  const startBraceIndex = data.indexOf('{');
  if (startBraceIndex !== -1) {
    const attributesRaw = data.slice(startBraceIndex + 1, -1).split(',');

    for (let i = 0; i < attributesRaw.length; i++) {
      const [name, value] = attributesRaw[i].split('=');
      if(/^\d+(:?.\d+)?$/.test(value)) {
        attributes.push({
          name: name,
          value: parseFloat(value),
        });
      } else if (value.includes('Inf')) {
        attributes.push({
          name: name,
          value: value.startsWith('-') ? -Infinity : +Infinity,
        });
      } else {
        attributes.push({
          name: name,
          value: JSON.parse(value),
        });
      }
    }

    if (startBraceIndex > 0) {
      const mayBeKind = data.slice(0, startBraceIndex).replace('_', '');

      if (['sum', 'count', 'bucket'].includes(mayBeKind)) {
        kind = mayBeKind as MetricKind;
      }
    }
  } else if (data) {
    const mayBeKind = data.replace('_', '');
    if (['sum', 'count', 'bucket'].includes(mayBeKind)) {
      kind = mayBeKind as MetricKind;
    }
  }

  return {
    value: value,
    unit: unit,
    kind: kind,
    attributes: attributes,
  }
}

function groupingMetrics(metrics: Metric[]): { [system: string]: Metric[] } {
  const grouping: { [system: string]: Metric[] } = {};

  for (let i = 0; i < metrics.length; i++) {
    const metric = metrics[i];

    grouping[metric.system] = grouping[metric.system] || [];
    grouping[metric.system].push(metric);
  }
  return grouping;
}

export function parseMetrics(text: string): { [system: string]: Metric[] } {
  const blocks = text.split('# HELP');
  const metrics: Metric[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    if (!block) continue;

    const [,,id, type] = /(#\sTYPE)\s([a-z_-]+)\s([a-z]+)\s/.exec(block) || [];

    const metric: Metric = {
      ...parseMetricId(id),
      type: type as MetricType,
      description: '',
      dataPoints: [],
    };
    
    const lines = block.split('\n');
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];

      if (j === 0) {
        metric.description = line.replace(id, '').trim();
      } else if (j === 1) {
        /* noop */
      } else {
        const dataPoint = parseDataPoint(id, line, metric.unit);
        metric.dataPoints.push(dataPoint);
      }
    }

    metrics.push(metric);
  }

  return groupingMetrics(metrics);
}