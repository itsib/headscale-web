import { FC, useEffect, useState } from 'react';
import { DataPoint, MetricType, MetricUnit } from '@app-types';
import { FormattedMetric } from '@app-components/formatters/formatted-metric.tsx';
import { ChartBar, ChartBars } from '@app-components/chart-bars/chart-bars.tsx';

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

export interface DataPointDisplayProps {
  id: string;
  type: MetricType;
  unit?: MetricUnit;
  dataPoints: DataPoint[];
}

export const DataPoints: FC<DataPointDisplayProps> = ({ unit, dataPoints }) => {

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
  const [bars, setBars] = useState<ChartBar[] | undefined>(undefined);

  useEffect(() => {
    const bars: { label: string, value: number }[] = [];

    for (let i = 0; i < dataPoints.length; i += 1) {
      const dataPoint = dataPoints[i];
      if (dataPoint.kind !== 'value' || !dataPoint.attributes.length) continue;

      const attr = dataPoint.attributes[0];
      const label = `${attr.value}`;

      const value = parseFloat(dataPoint.value as string);

      bars.push({ label, value });
    }

    setBars(bars);

  }, [dataPoints, unit]);

  return (
    <div className="bar-chart">
      <ChartBars bars={bars} unit={unit} />
    </div>
  );
}