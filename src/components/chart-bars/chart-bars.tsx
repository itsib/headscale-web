import { memo } from 'preact/compat';

export interface ChartBar {
  value: number;
  label?: string;
}

export interface ChartBarsProps {
  bars: ChartBar[];
  unit?: string;
}

export const ChartBars = memo(function ChartBars({ bars, unit: _ }: ChartBarsProps) {
  let maxLabelWidth = 0;
  let maxValue = 0;

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];
    if (bar.value > maxValue) {
      maxValue = bar.value;
    }
    const labelWidth = (bar.label?.length || 0) * 8;
    if (maxLabelWidth < labelWidth) {
      maxLabelWidth = labelWidth;
    }
  }

  const margin = { t: 0, r: 0, l: 0, b: 0 };
  const innerWidth = 240;
  const barHeight = 26;
  const width = innerWidth + maxLabelWidth + margin.l + margin.r;
  const innerHeight = bars.length * barHeight;
  const height = innerHeight + margin.t + margin.b;
  const fontSize = 12;

  const scaleY = (index: number) => Math.round(margin.t + (innerHeight / bars.length * index));

  const scaleX = (value: number) => Math.round(innerWidth / maxValue * value);

  return (
    <div className="bar-chart">
      <svg
        width={width}
        height={height}
        style={{ maxWidth: '100%', height: 'auto' }}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          {bars.map((bar, index) => (
            <g key={index}>
              <rect
                fill="none"
                x={margin.l}
                y={scaleY(index) + 3}
                width={innerWidth + maxLabelWidth}
                height={barHeight - 6}
              />
              <rect
                class="bar"
                fill="rgba(var(--text-secondary))"
                x={width - scaleX(bar.value)}
                y={scaleY(index) + 3}
                width={scaleX(bar.value || 1)}
                height={barHeight - 6}
                transform="scale(0 1)"
                transform-origin="center right"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="xml"
                  type="scale"
                  dur="0.5s"
                  begin="0.1s"
                  repeatCount="1"
                  fill="freeze"
                  calcMode="spline"
                  values="0 1; 1 1"
                  keyTimes="0; 1"
                  keySplines="0.07 0.55 0.7 0.9"
                />
              </rect>
              <text
                id={`textAnimation-${index}`}
                fill="rgba(var(--text-primary) / 1)"
                x={width - scaleX(bar.value) - 6}
                y={scaleY(index) + fontSize + 6}
                text-anchor="end"
                font-size={fontSize}
                font-weight={400}
                transform="translate(0 0)"
              >
                {bar.label}
              </text>

              <animateTransform
                attributeName="transform"
                attributeType="xml"
                type="translate"
                dur="0.5s"
                begin="0.1s"
                repeatCount="1"
                fill="freeze"
                calcMode="spline"
                values={`${scaleX(bar.value || 1)},0; 0,0`}
                keyTimes="0; 1"
                keySplines="0.07 0.55 0.7 0.9"
                xlinkHref={`#textAnimation-${index}`}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}, comparator);

function comparator(prev: ChartBarsProps, next: ChartBarsProps) {
  if (prev.unit !== next.unit || prev.bars.length !== next.bars.length) {
    return false;
  }
  if (prev.bars === next.bars) {
    return true;
  }

  for (let i = 0; i < prev.bars.length; i++) {
    if (next.bars[i].label !== prev.bars[i].label || next.bars[i].value !== prev.bars[i].value) {
      return false;
    }
  }
  return true;
}
