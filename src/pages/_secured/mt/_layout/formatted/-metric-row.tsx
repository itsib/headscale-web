import { FC } from 'react';
import { Metric } from '../../../../../types';
import { DataPoints } from './-data-points.tsx';

export const MetricItem: FC<Metric> = ({ id, name, description, dataPoints, type }) => {
  const title = name
    .replace(/http/ig, 'HTTP')
    .replace(/cpu/ig, 'CPU')
    .replace(/fds/ig, 'file descriptors')
    .replace(/gomemlimit/ig, 'Go memory limit')
    .replace(/alloc/ig, 'allocation')
    .replace(/^(\w)/, (_match: string, first: string) => first.toUpperCase());

  return (
    <div className="py-2 border-primary border-t flex justify-between items-start">
      <div className="text-base w-1/2">
        <div>{title}</div>
        <div className="text-xs text-secondary opacity-60">{description}</div>
      </div>

      <div className="text-right">
        <DataPoints id={id} type={type} dataPoints={dataPoints} />
      </div>
    </div>
  );
};
