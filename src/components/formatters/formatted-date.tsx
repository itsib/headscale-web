import {  useMemo } from 'preact/hooks';
import type { FunctionComponent } from 'preact';
import { useTranslation } from 'react-i18next';

export interface IFormattedDate extends Intl.DateTimeFormatOptions {
  className?: string;
  timestamp?: number | string;
  iso?: string;
}

export const FormattedDate: FunctionComponent<IFormattedDate & Intl.DateTimeFormatOptions> = ({ className, timestamp, iso, ...props }) => {
  const { i18n } = useTranslation();

  const formatter = useMemo(() => new Intl.DateTimeFormat(i18n.language, { ...props }), [i18n.language, props]);

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
    return formatter.format(date);
  }, [formatter, timestamp, iso]);

  return (
    <span className={className}>{formatted}</span>
  );
};
