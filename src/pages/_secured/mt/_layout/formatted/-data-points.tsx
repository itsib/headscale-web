import { FC, useEffect, useRef } from 'react';
import { DataPoint, MetricType, MetricUnit } from '../../../../../types';
import { FormattedMetric } from '../../../../../components/formatters/formatted-metric.tsx';
import { d3BarChart } from '../../../../../utils/d3-bar-chart.ts';

export interface DataPointDisplayProps {
  id: string;
  type: MetricType;
  unit?: MetricUnit;
  dataPoints: DataPoint[];
}

export const DataPoints: FC<DataPointDisplayProps> = ({ id, type, unit, dataPoints }) => {
  useEffect(() => {
    // if (dataPoints.length > 1) {
    //   console.log(id, type, dataPoints)
    // }
  }, [id, dataPoints, type]);

  function isBarChart(dataPoints: DataPoint[]) {
    let isEveryHaveOneAttr = true;

    for (let i = 0; i < dataPoints.length; i++) {
      const dataPoint = dataPoints[i];
      if (dataPoint.kind === 'sum' || dataPoint.kind === 'count') {
        continue;
      }

      if (dataPoint.attributes.length !== 1) {
        isEveryHaveOneAttr = false;
        break;
      }
    }
    return isEveryHaveOneAttr;
  }

  return dataPoints.length === 1 ? (
    <DataPointsSingle {...dataPoints[0]} />
  ) : isBarChart(dataPoints) ? (
    <DataPointsBarChart unit={unit} dataPoints={dataPoints} />
  ) : null;
}

function DataPointsSingle({ value, unit, attributes }: DataPoint) {
  return (
    <div>
      <div className="text-sm whitespace-nowrap" data-measure={unit}>
        <FormattedMetric value={value} unit={unit}/>
      </div>
      <div className="text-xs text-secondary">
        {attributes.map(({ name, value }) => (
          <div key={name} className="whitespace-nowrap">
            <span>{name}:&nbsp;</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataPointsBarChart({ dataPoints, unit }: { dataPoints: DataPoint[]; unit?: MetricUnit }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const bars: { bar: string, value: number }[] = [];
    let barLabel: string | undefined = undefined;

    for (let i = 0; i < dataPoints.length; i += 1) {
      const dataPoint = dataPoints[i];
      if (dataPoint.kind !== 'value' || !dataPoint.attributes.length) continue;

      const attr = dataPoint.attributes[0];
      const bar = `${attr.value}`;

      const value = parseFloat(dataPoint.value as string);

      bars.push({ bar, value });
      barLabel = attr.name;
    }

    return d3BarChart(container, { bars, barLabel, valueLabel: unit });
  }, [dataPoints, unit]);

  return (
    <div className="bar-chart" ref={ref} />
  );
}