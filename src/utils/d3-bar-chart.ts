import * as d3 from 'd3';

export interface TDataset {
  bars: { bar: string, value: number }[];
  barLabel?: string;
  valueLabel?: string;
}

export function d3BarChart(container: HTMLElement, dataset: TDataset) {
  const { bars, barLabel } = dataset;
  const maxValue = d3.max(bars, (d) => d.value) as number;
  const marginLeft = d3.max(bars, (d) => (d.bar.length * 8)) as number;
  const margin = { t: 14, r: 0, l: marginLeft, b: 20 };
  const innerWidth = 240;
  const barHeight = 26;
  const width = innerWidth + margin.l + margin.r;
  const innerHeight = bars.length * barHeight;
  const height = innerHeight + margin.t + margin.b;
  const fontSize = 11;

  const element = d3.select(container);
  element.selectAll('*').remove();

  const svg = element.append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto;')
    .attr('xmlns', 'http://www.w3.org/2000/svg');


  const scaleX = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, width - margin.r]);

  const scaleY = d3.scaleLinear()
    .domain([0, bars.length])
    .range([margin.t, height - margin.b]);

  svg.append('g')
    .selectAll()
    .data(bars)
    .join(enter => {
      enter.append('text')
        .attr('x', margin.l - 6)
        .attr('y', (_, index) => scaleY(index) + fontSize + 6)
        .attr('fill', 'rgba(var(--text-primary) / 1)')
        .attr('text-anchor', 'end')
        .attr('font-size', fontSize)
        .attr('font-weight', 300)
        .text((d) => d.bar);

      return enter.append('g')
        .call(g => g.append('rect')
          .attr('fill', 'transparent')
          .attr('x', margin.l)
          .attr('y', (_, index) => scaleY(index) + 3)
          .attr('width', innerWidth)
          .attr('height', barHeight - 6))
        .call(g => g.append('rect')
          .attr('fill', 'rgba(var(--text-secondary))')
          .attr('x', margin.l)
          .attr('y', (_, index) => scaleY(index) + 3)
          .attr('width', (d) => scaleX(d.value))
          .attr('height', barHeight - 6)
          .transition()
          .ease(d3.easeExpOut)
          .duration(1500)
          .attrTween('width', (d): ((t: number) => string) => {
            const interpolate = d3.interpolateNumber(0, d.value);
            return (t: number) => scaleX(interpolate(t)).toString();
          }))
        .call(g => g.on('mouseenter', (e) => {
          d3
            .select(e.currentTarget)
            .selectChild((_, i) => i === 1)
            .attr('fill', 'rgba(var(--accent) / 0.8)');
        }))
        .call(g => g.on('mouseout', (e) => {
          d3
            .select(e.currentTarget)
            .selectChild((_, i) => i === 1)
            .attr('fill', 'rgba(var(--text-secondary))');
        }));
    });


  if (barLabel) {
    svg.append('g')
      .call(g => g.append('text')
        .attr('x', 0)
        .attr('y', fontSize)
        .attr('fill', '#FFFFFF')
        .attr('text-anchor', 'start')
        .attr('font-size', fontSize + 1)
        .text(barLabel),
      );
  }


  // svg.append('g')
  //   .attr('transform', `translate(0,${height - margin.b})`)
  //   .call(axisBottom);
  //
  // svg.append("g")
  //   .attr("transform", `translate(${margin.l},0)`)
  //   .call(axisLeft)
  //   .call((g) => g.select(".domain").remove());


  return () => {
    element.selectAll('*').remove();
  };
}