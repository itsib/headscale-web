import { Measure } from '../types';

const INTEGER_REGEX = /^\d+$/;
const SCIENTIFIC_REGEX = /^(\d+(?:\.\d+)?)(e[+-]?)(\d+)$/;

export function shortifyValue(value: string, measure?: Measure | null) {
  if (!measure) return value;

  if (measure === 'percent') {
    return value + '%'
  } else if (measure === 'bytes') {
    const { format } = Intl.NumberFormat('en-EN', { style: 'decimal', useGrouping: true,  });
    const bytes = parseInt(value, 10);
    if (bytes < 1024) {
      return `${format(bytes)} b`
    }
    const kBytes = Math.floor(bytes / 102.4) / 10;
    if (kBytes < (1024)) {
      return `${format(kBytes)} Kb`;
    }
    const mBytes = Math.floor(kBytes / 102.4) / 10;
    if (mBytes < 1024) {
      return `${format(mBytes)} Mb`;
    }
    const gBytes = Math.floor(mBytes / 102.4) / 10;
    if (gBytes < 1024) {
      return `${format(gBytes)} Gb`;
    }
    const tBytes = Math.floor(mBytes / 102.4) / 10;
    return `${format(tBytes)} Tb`;
  } else if (measure === 'seconds') {
    const seconds = parseFloat(value);
    if (seconds > 1500000000) {
      const { format } = Intl.DateTimeFormat('ru', { dateStyle: 'medium', timeStyle: 'medium' });
      return format(new Date(seconds * 1000));
    }


    if (seconds < 60) {
      return `${Math.floor(seconds * 1000) / 1000} sec`;
    }
    const minutes = Math.floor(seconds / 6) / 10;
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 6) / 10;
    if (hours < 60) {
      return `${hours} hours`;
    }
    const days = Math.floor(hours / 24);
    return `${days} days`;
  }

  return value;
}

export function formatNumbers(value: string, measure?: Measure | null): string {
  if (INTEGER_REGEX.test(value)) {
    return shortifyValue(value, measure);
  }
  const matched = value.match(SCIENTIFIC_REGEX);
  if (matched) {
    const [, _significant, sign, _power] = matched;
    const power = parseInt(_power, 10) * (sign === 'e-' ? -1 : 1);
    const dot = _significant.indexOf('.');
    let significant = _significant.replace('.', '');

    let newDotPos = (dot === -1 ? 1 : dot) + power;
    if (newDotPos > significant.length) {
      significant = significant + '0'.repeat(newDotPos - significant.length);
    } else if (newDotPos <= 0) {
      significant = '0'.repeat(Math.abs(newDotPos) + 1) + significant;
      newDotPos = 1
    }
    const integer = significant.slice(0, newDotPos);
    const fractional = significant.slice(newDotPos);
    if (fractional.length === 0) {
      return shortifyValue(integer, measure);
    }
    return shortifyValue(integer + '.' + fractional, measure);
  }

  return shortifyValue(value, measure);
}