import { MetricRowProps } from '../types';

export function parseGoMetrics(text: string): MetricRowProps[] {
  const lines = text.split('\n');

  const metrics: { [key: string]: MetricRowProps } = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('# HELP ')) {
      const [id, ...other] = line.replace('# HELP ', '').split(' ');
      const description = other.join(' ');

      if (!lines[i + 1].includes(id)) {
        console.warn('No found', id);
        break;
      }
      i = i + 1

      const type = lines[i].replace(`# TYPE ${id}`, '').trim();

      const [group, ...segments] = id.replace('go_', '').split('_');

      const metric: MetricRowProps = {
        id: segments.length === 0 ? group : segments.join('_'),
        group,
        type,
        description,
        data: null
      };

      if (!lines[i + 1].includes(id)) {
        console.warn('No found', id);
        break;
      }

      switch (type) {
        case 'gauge':
          i++
          metric.data = lines[i].replace(id, '').trim()
          break;
        case 'histogram':
        case 'counter':
        case 'summary':
          metric.data = {};
          while(lines[i + 1].startsWith(id)) {
            i++;
            const dataLine = lines[i]

            const [key, value] = dataLine.split(' ')

            metric.data[key] = value
          }
          break;
      }

      metrics[id] = metric;
    }



  }


  return Object.values(metrics);
}