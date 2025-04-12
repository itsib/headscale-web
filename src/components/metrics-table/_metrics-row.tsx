import { FunctionComponent } from 'preact';
import { Fragment } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import { DataPoint, Metric } from '@app-types';
import { FormattedMetric } from '@app-components/formatters/formatted-metric';
import { ChartBar, ChartBars } from '@app-components/chart-bars/chart-bars';
import { useTranslation } from 'react-i18next';
import './_metrics-row.css';

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

export const MetricsRow: FunctionComponent<Metric> = props => {
  const { system, id, name, description, dataPoints } = props;
  return (
    <div id={`metric-${system}-${id}`} class="metrics-row">
      <h4>{name}</h4>

      <div class="main-info">
        <div className="description">{description}</div>

        {dataPoints.length === 1 ? (
          <SingleDataPointView {...props} />
        ) : isBarChart(dataPoints) ? (
          <BarChartDataPointView {...props}  />
        ) : (
          <SimpleRowsDataPointView {...props} />
        )}
      </div>
    </div>
  );
};

const SingleDataPointView: FunctionComponent<Metric> = ({ dataPoints }) => {
  const { unit, value, attributes } = dataPoints[0];
  return (
    <div className="single-data-point-view">
      <div className="main-value" data-measure={unit}>
        <FormattedMetric value={value} unit={unit} />
      </div>
      <div className="attributes">
        {attributes.map(({ name, value }) => (
          <div key={name} className="attr">
            <span>{name}:&nbsp;</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const BarChartDataPointView: FunctionComponent<Metric> = props => {
  const { dataPoints, unit } = props;
  const { t } = useTranslation();

  const [bars, setBars] = useState<ChartBar[] | undefined>(undefined);
  const [measure, setMeasure] = useState<string | undefined>(undefined);
  const [totals, setTotals] = useState<{ kind: string; unit?: string; value: string | number }[]>([]);

  useEffect(() => {
    const bars: { y: string, x: number }[] = [];
    const totals: { kind: string; unit?: string; value: string | number }[] = [];

    let isMeasureSet = false;
    for (let i = 0; i < dataPoints.length; i += 1) {
      const dataPoint = dataPoints[i];
      const attr = dataPoint.attributes?.[0];

      if (attr && attr.name && !isMeasureSet) {
        isMeasureSet = true;
        setMeasure(attr.name);
      }

      if (dataPoint.kind !== 'value' || !dataPoint.attributes.length) {
        totals.push({
          kind: dataPoint.kind,
          unit: dataPoint.unit,
          value: dataPoint.value,
        });
        continue;
      }
      const y = `${attr.value}`;
      const x = parseFloat(dataPoint.value as string);

      bars.push({ y, x });
    }

    setTotals(totals);
    setBars(bars);
  }, [dataPoints, unit]);

  return (
    <div class="bar-chart-data-point-view">
      {bars ? <ChartBars bars={bars} xAxis={unit} yAxis={measure} /> : null}

      <div class="totals">
        {totals.map((total, index) => (
          <Fragment  key={index}>
            <div class="title">{index === 0 ? t('totals') + ':': null}</div>
            <div class="total-label">{total.kind}</div>
            <div class="total-value">{total.value}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const SimpleRowsDataPointView: FunctionComponent<Metric> = () => {
  return (
    <div class="simple-rows-data-point-view"></div>
  );
};

