import { memo } from 'preact/compat';
import { useId } from '@app-hooks/use-id';
import { getStringSize } from '@app-utils/get-string-size';

export interface ChartBar {
  x: number;
  y: number | string;
}

export interface ChartBarsProps {
  bars: ChartBar[];
  xAxis?: string;
  yAxis?: string;
}

export const ChartBars = memo(function ChartBars({ bars, xAxis, yAxis }: ChartBarsProps) {
  const id = useId();
  const fontConfig = {
    size: 11,
    weight: 400,
    family: 'SFProText',
  };

  let lineHeight = 0;
  let maxX = 0;
  let maxYWidth = 0;
  let maxXWidth = 0;

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];
    maxX = Math.max(bar.x, maxX);

    const xSize = getStringSize(bar.x, fontConfig);
    if (xSize) {
      maxXWidth = Math.max(xSize.width, maxXWidth);
      lineHeight = Math.max(xSize.height, lineHeight);
    }

    const labelSize = bar.y ? getStringSize(bar.y, fontConfig) : { width: 0, height: 0 };
    if (labelSize) {
      maxYWidth = Math.max(labelSize.width, maxYWidth);
    }
  }

  const margin = { t: 0, r: 0, l: 0, b: 0 };
  const space = 6;
  const maxBarWidth = 240;
  const barHeight = 22;
  const maxBarsHeight = bars.length * (barHeight + space);

  const barsBaseXAxis = margin.l + maxXWidth + space + maxBarWidth;
  const labelsBaseXAxis = barsBaseXAxis + space;
  const width = labelsBaseXAxis + maxYWidth + space + lineHeight + margin.r;

  const height = margin.t + maxBarsHeight + space + lineHeight + margin.b;

  const textPadding = (barHeight - space / 2 - lineHeight) / 2;

  const scaleY = (index: number) =>
    margin.t + (index > 0 ? Math.round((maxBarsHeight / bars.length) * index) : 0);

  const scaleX = (value: number) => Math.round((maxBarWidth / maxX) * value);

  return (
    <div className="chart-bars">
      <svg
        id={id}
        width={width}
        height={height}
        style={{ maxWidth: '100%', height: 'auto' }}
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {bars.map((bar, index) => {
          const _y = scaleY(index);
          const _x = barsBaseXAxis - scaleX(bar.x);
          const _width = Math.max(scaleX(bar.x || 0), 1);

          return (
            <g class="data-segment" key={index}>
              <g opacity="0" className="value">
                <text
                  className="bar-value"
                  x={_x - space}
                  y={_y + lineHeight + textPadding}
                  text-anchor="end"
                  font-family={fontConfig.family}
                  font-size={fontConfig.size}
                  font-weight={fontConfig.weight}
                  fill="rgb(var(--text-primary))"
                >
                  {bar.x}
                </text>

                <animate
                  attributeName="opacity"
                  dur="0.15s"
                  begin="0.6s"
                  repeatCount="1"
                  fill="freeze"
                  from="0"
                  to="0.8"
                />
              </g>

              <rect
                class="bar"
                x={_x}
                y={_y}
                width={_width}
                height={barHeight}
                transform="scale(0 1)"
                transform-origin={`${barsBaseXAxis} center`}
                fill={`var(--bar-color-${index + 1})`}
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

              <g className="label">
                <text
                  className="bar-label"
                  x={labelsBaseXAxis}
                  y={_y + lineHeight + textPadding}
                  text-anchor="start"
                  font-family={fontConfig.family}
                  font-size={fontConfig.size}
                  font-weight={fontConfig.weight}
                  fill="rgb(var(--text-primary))"
                >
                  {bar.y}
                </text>
              </g>
            </g>
          );
        })}

        <g fill="rgb(var(--text-secondary))">
          {yAxis ? (
            <text
              className="y-axis-name"
              x={labelsBaseXAxis + space + maxYWidth}
              y={margin.t + maxBarsHeight / 2}
              text-anchor="center center"
              font-family={fontConfig.family}
              font-size={fontConfig.size}
              font-weight={fontConfig.weight}
              transform-origin={`${labelsBaseXAxis + space + maxYWidth + space} ${margin.t + maxBarsHeight / 2}`}
              transform="rotate(-90)"
            >
              {yAxis}
            </text>
          ) : null}

          {xAxis ? (
            <text
              className="x-axis-name"
              x={barsBaseXAxis - space}
              y={maxBarsHeight + space}
              text-anchor="end"
              font-family={fontConfig.family}
              font-size={fontConfig.size}
              font-weight={fontConfig.weight}
            >
              {xAxis}
            </text>
          ) : null}
        </g>
      </svg>
    </div>
  );
}, comparator);

function comparator(prev: ChartBarsProps, next: ChartBarsProps) {
  if (
    prev.xAxis !== next.xAxis ||
    prev.yAxis !== next.yAxis ||
    prev.bars.length !== next.bars.length
  ) {
    return false;
  }
  if (prev.bars === next.bars) {
    return true;
  }

  for (let i = 0; i < prev.bars.length; i++) {
    if (next.bars[i].y !== prev.bars[i].y || next.bars[i].x !== prev.bars[i].x) {
      return false;
    }
  }
  return true;
}
