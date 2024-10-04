import React, { FC, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SECOND_MS = 1_000;
const MINUTE_MS = 60_000;
const HOUR_MS = MINUTE_MS * 60;
const DAY_MS = HOUR_MS * 24;
const MONTH_MS = DAY_MS * 30;

export interface IFormattedDate extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  timestamp?: number | string;
  iso?: string;
  format?: 'long' | 'short' | 'narrow';
}

export const FormattedDuration: FC<IFormattedDate> = ({ timestamp, iso, format = 'long', ...props }) => {
  const { i18n } = useTranslation();
  const [period, setPeriod] = useState<number>(MONTH_MS);
  const [count, setCount] = useReducer(x => x + 1, 0);

  const formatted: string | null = useMemo(() => {
    if (!timestamp && !iso) {
      return null;
    }

    let date: Date;
    if (iso) {
      date = new Date(Date.parse(iso));
    } else if (`${timestamp}`.length < 11) {
      date = new Date(Math.floor(+timestamp! * 1000));
    } else {
      date = new Date(+timestamp!);
    }
    const duration = Date.now() - date.getTime();

    const rtf = new Intl.RelativeTimeFormat(i18n.language, {
      localeMatcher: 'lookup', //'best fit',
      numeric: 'always', // 'always',
      style: format,
    });

    if (Math.abs(duration) < MINUTE_MS) {
      setPeriod(SECOND_MS);
      return rtf.format(-Math.floor(duration / SECOND_MS), 'seconds');
    } else if (Math.abs(duration) < HOUR_MS) {
      setPeriod(MINUTE_MS);
      return rtf.format(-Math.floor(duration / MINUTE_MS), 'minutes');
    } else if (Math.abs(duration) < DAY_MS) {
      setPeriod(HOUR_MS);
      return rtf.format(-Math.floor(duration / HOUR_MS), 'hours');
    } else if (Math.abs(duration) < MONTH_MS) {
      setPeriod(DAY_MS);
      return rtf.format(-Math.floor(duration / DAY_MS), 'days');
    } else {
      setPeriod(MONTH_MS);
      return rtf.format(-Math.floor(duration / MONTH_MS), 'months');
    }
  }, [count, timestamp, iso]);

  useEffect(() => {
    const interval = setInterval(() => setCount(), period);

    return () => {
      clearInterval(interval);
    };
  }, [period]);

  return (
    <span {...props}>{formatted}</span>
  );
};
