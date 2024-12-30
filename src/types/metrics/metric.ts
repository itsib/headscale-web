export type MetricType = 'gauge' | 'summary' | 'counter' | 'histogram';
export type MetricUnit = 'seconds' | 'percent' | 'bytes' | 'requests' | 'objects' | 'threads';
export type MetricKind = 'sum' | 'count' | 'bucket' | 'value';

export interface DataPointAttribute {
  name: string;
  value: string | number;
}

export interface DataPoint {
  value: string | number;
  unit?: MetricUnit;
  kind: MetricKind;
  attributes: DataPointAttribute[];
}

export interface Metric {
  id: string;
  system: string;
  name: string;
  description: string;
  type: MetricType;
  isTotal: boolean;
  unit?: MetricUnit;
  dataPoints: DataPoint[];
}
