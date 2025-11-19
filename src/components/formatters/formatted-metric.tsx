import { useMemo } from 'react';
import type { FC } from 'react';
import { MetricUnit } from '@app-types';
import { formatUnits, normalizeNumber } from '../../utils/format-numbers.ts';

export interface FormattedMetricProps {
  value: number | string;
  unit?: MetricUnit;
}

export const FormattedMetric: FC<FormattedMetricProps> = ({ value, unit }) => {
  const formatted = useMemo(() => {
    value = normalizeNumber(value);

    return formatUnits(value, unit);
  }, [value, unit]);

  return <>{formatted}</>;
};
