import { FC, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DataPoint, MetricType } from '../../../../../types';
import { FormattedMetric } from '../../../../../components/formatters/formatted-metric.tsx';

export interface DataPointDisplayProps {
  id: string;
  type: MetricType;
  dataPoints: DataPoint[];
}

export const DataPoints: FC<DataPointDisplayProps> = ({ id, type, dataPoints }) => {
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
    <DataPointsBarChart dataPoints={dataPoints} />
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

function DataPointsBarChart({ dataPoints }: { dataPoints: DataPoint[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const bars: { value: number, bar: number }[] = [];
    let maxValue = 0

    for (let i = 0; i < dataPoints.length; i += 1) {
      const dataPoint = dataPoints[i];
      if (dataPoint.kind !== 'value' || !dataPoint.attributes.length) continue;

      const bar = parseFloat(dataPoint.attributes[0].value as string);
      const value = parseFloat(dataPoint.value as string);
      maxValue = Math.max(maxValue, value);

      bars.push({ value, bar });
    }

    const width = 200;
    const height = 140;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const scaleX = d3.scaleLinear()
      .domain([0, bars.length])
      .range([0, width]);

    const scaleY = d3.scaleLinear()
      .domain([0, maxValue])
      .range([height, 0]);

    const barWidth = Math.floor(width / bars.length)

    svg.append('g')
      .selectAll()
      .data(bars)
      .join(enter => {
        return enter.append('g')
          .call(g => g.append('rect')
            .attr('fill', 'transparent')
            .attr('x', (_d, index) => scaleX(index))
            .attr('width', barWidth - 1)
            .attr('y', scaleY(maxValue))
            .attr('height', scaleY(0))
          )
          .call(g => g.append('rect')
            .attr('data-index', (_d, index) => `${index}`)
            .attr('fill', 'rgba(var(--text-primary) / 0.8)')
            .attr('x', (_d, index) => scaleX(index))
            .attr('width', () => barWidth - 1)
            .attr('y', (d) => scaleY(d.value))
            .attr('height', (d) => scaleY(0) - scaleY(d.value))
          )
          .call(g => g.on('mouseenter', (e) => {
            d3
              .select(e.currentTarget)
              .selectChild((_, i) => i === 1)
              .attr('fill', 'rgba(var(--accent) / 0.8)');
            })
          )
          .call(g => g.on('mouseout', (e) => {
            d3
              .select(e.currentTarget)
              .selectChild((_, i) => i === 1)
              .attr('fill', 'rgba(var(--text-primary))');
            })
          );
      });

    d3.axisLeft(scaleX)

    return () => {
      if (container) {
        container.innerHTML = ''
      }
    };
  }, [dataPoints]);

  return (
    <div className="bar-chart" ref={ref} />
  );
}