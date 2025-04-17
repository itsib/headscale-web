export type DurationFormat = 'long' | 'short' | 'narrow';
export type DateFormat = 'full' | 'long' | 'medium' | 'short';
export type TimeFormat = 'full' | 'long' | 'medium' | 'short';

export interface FormatDurationOpts {
  language?: string;
  format?: DurationFormat;
}

export interface FormatDateOpts {
  language?: string;
  dateFormat?: DateFormat;
  timeFormat?: TimeFormat;
  is24Hour?: boolean;
}

const SECOND_MS = 1_000;
const MINUTE_MS = 60_000;
const HOUR_MS = MINUTE_MS * 60;
const DAY_MS = HOUR_MS * 24;
const MONTH_MS = DAY_MS * 30;

export function parseDate(input?: string | number): Date | null {
  if (input == null) return null;

  if (typeof input === 'string') {
    input = /^\d+$/.test(input) ? parseInt(input) : Date.parse(input);
  }

  if (isNaN(input) || input <= 0 ||!isFinite(input)) return null;

  // Convert to ms
  if (input < 3000000000) {
    input = input * 1000;
  }
  return new Date(input);
}

export function formatDuration(input?: string | number, opts: FormatDurationOpts = {}): string | null {
  const date = parseDate(input);
  if (date == null) return null;

  const { language = 'en', format = 'long' } = opts;
  const duration = Date.now() - date.getTime();

  const rtf = new Intl.RelativeTimeFormat(language, {
    localeMatcher: 'lookup', //'best fit',
    numeric: 'always', // 'always',
    style: format,
  });

  if (Math.abs(duration) < MINUTE_MS) {
    return rtf.format(-Math.floor(duration / SECOND_MS), 'seconds');
  } else if (Math.abs(duration) < HOUR_MS) {
    return rtf.format(-Math.floor(duration / MINUTE_MS), 'minutes');
  } else if (Math.abs(duration) < DAY_MS) {
    return rtf.format(-Math.floor(duration / HOUR_MS), 'hours');
  } else if (Math.abs(duration) < MONTH_MS) {
    return rtf.format(-Math.floor(duration / DAY_MS), 'days');
  } else {
    return rtf.format(-Math.floor(duration / MONTH_MS), 'months');
  }
}

export function formatDate(input?: string | number, opts: FormatDateOpts = {}): string | null {
  const date = parseDate(input);
  if (date == null) return null;

  const { language = 'en', dateFormat = 'medium', timeFormat = 'medium', is24Hour = true } = opts;
  const formatter = new Intl.DateTimeFormat(language, {
    dateStyle: dateFormat,
    timeStyle: timeFormat,
    hourCycle: is24Hour ? 'h24' : 'h12',
  });

  return formatter.format(date);
}