import { useEffect, useRef, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { Selection, max, scaleLinear, easeSinOut, interpolateNumber, select as d3Select } from 'd3';

export interface ChartBar {
  value: number;
  label?: string;
}

export interface ChartBarsProps {
  bars?: ChartBar[];
  unit?: string;
}

export const ChartBars: FunctionComponent<ChartBarsProps> = ({ bars: _bars, unit }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<Selection<HTMLDivElement, ChartBar[], null, undefined>>();
  const [bars, setBars] = useState<ChartBar[] | undefined>(undefined);

  useEffect(() => {
    setBars(old => {
      if (!old || (_bars && old.length !== _bars.length)) return _bars;

      if (old && _bars && !old.some((bar, i) => (bar.value !== _bars[i].value || bar.label !== _bars[i].label))) {
        return old;
      }
      return _bars;
    });
  }, [_bars]);

  useEffect(() => {
    if (!container || !bars) return;

    let initData = container.datum();
    if (!initData) {
      initData = bars.map(bar => ({ value: 0, label: bar.label }));
    }
    container.datum(bars);

    const maxLabelWidth = max(bars, (d) => (`${d.value}`?.length || 0) * 8) as number;
    const maxValue = max(bars, (d) => d.value) as number;
    const margin = { t: 0, r: 0, l: 0, b: 0 };
    const innerWidth = 240;
    const barHeight = 26;
    const width = innerWidth + maxLabelWidth + margin.l + margin.r;
    const innerHeight = bars.length * barHeight;
    const height = innerHeight + margin.t + margin.b;
    const fontSize = 12;

    container.selectAll('*').remove();

    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;')
      .attr('xmlns', 'http://www.w3.org/2000/svg')

    const scaleX = scaleLinear()
      .domain([0, maxValue])
      .range([0, innerWidth]);

    const scaleY = scaleLinear()
      .domain([0, bars.length])
      .range([margin.t, height - margin.b]);

    const prev = (index: number) => initData[index]?.value || 0;

    svg
      .append('g')
      .selectAll()
      .data(bars)
      .join(
        elem => {
          return elem.append('g')
            // Outline rect
            .call(g => g.append('rect')
              .attr('fill', 'transparent')
              .attr('x', margin.l)
              .attr('y', (_, index) => scaleY(index) + 3)
              .attr('width', innerWidth + maxLabelWidth)
              .attr('height', barHeight - 6)
            )
            // Bar rect
            .call(g => g.append('rect')
              .attr('class', 'bar')
              .attr('fill', 'rgba(var(--text-secondary))')
              .attr('x', (d) => innerWidth - scaleX(d.value))
              .attr('y', (_, index) => scaleY(index) + 3)
              .attr('width', (d) => scaleX(d.value || 1))
              .attr('height', barHeight - 6)
              .transition()
              .ease(easeSinOut)
              .duration(1500)
              .attrTween('width', (d, i): ((t: number) => string) => {
                const interpolate = interpolateNumber(prev(i), d.value);
                return (t: number) => {
                  const width = scaleX(interpolate(t));
                  return Math.max(width, 1).toString();
                };
              })
              .attrTween('x', (d, i): ((t: number) => string) => {
                const interpolate = interpolateNumber(prev(i), d.value);
                return (t: number) => {
                  const fullWidth = maxLabelWidth + innerWidth;
                  const x = fullWidth - scaleX(interpolate(t));
                  return Math.min(x, fullWidth - 1).toString();
                };
              })
            )
            // Value text
            .call(g => g.append('text')
              .attr('fill', 'rgba(var(--text-primary) / 1)')
              .attr('x', (d) => innerWidth - scaleX(d.value) - 6)
              .attr('y', (_, index) => scaleY(index) + fontSize + 6)
              .attr('text-anchor', 'end')
              .attr('font-size', fontSize)
              .attr('font-weight', 400)
              .text((d) => d.value)
              .transition()
              .ease(easeSinOut)
              .duration(1500)
              .attrTween('x', (d, i): ((t: number) => string) => {
                const interpolate = interpolateNumber(prev(i), d.value);
                return (t: number) => ((maxLabelWidth + innerWidth - 6) - scaleX(interpolate(t))).toString();
              })
              .textTween((d, i): ((t: number) => string) => {
                const decimals = d.value.toString().split('.')[1]?.length || 0;
                const precision = (10 ** decimals);

                const interpolate = interpolateNumber(prev(i), d.value);
                return (t: number) => {
                  return (Math.round(interpolate(t) * precision) / precision).toString();
                };
              })
            )
            .call(g => g.on('mouseenter', (e) => {
              d3Select(e.currentTarget)
                .select('.bar')
                .attr('fill', 'rgba(var(--accent) / 0.8)');
            }))
            .call(g => g.on('mouseout', (e) => {
              d3Select(e.currentTarget)
                .select('.bar')
                .attr('fill', 'rgba(var(--text-secondary))');
            }));
          }
      );
  }, [container, bars, unit]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const container = d3Select<HTMLDivElement, ChartBar[]>(element);
    setContainer(container);

    return () => {
      container.selectAll('*').remove();
    };
  }, []);

  return (
    <div className="bar-chart" ref={ref} />
  );
};