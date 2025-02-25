import { useMemo } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { MetricUnit } from '@app-types';
import { formatUnits, normalizeNumber } from '../../utils/format-numbers.ts';

export interface FormattedMetricProps {
  value: number | string;
  unit?: MetricUnit;
}

export const FormattedMetric: FunctionComponent<FormattedMetricProps> = ({ value, unit }) => {
  const formatted = useMemo(() => {
    value = normalizeNumber(value);

    return formatUnits(value, unit);
  }, [value, unit]);

  return <>{formatted}</>;
};