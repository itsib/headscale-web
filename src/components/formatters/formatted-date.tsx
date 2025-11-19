import { useMemo } from 'react';
import type { FC, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, FormatDateOpts } from '@app-utils/format-date.ts';

export interface IFormattedDate extends Omit<FormatDateOpts, 'language'> {
  date?: string | number;
  className?: string;
  style?: CSSProperties;
}

export const FormattedDate: FC<IFormattedDate> = (props) => {
  const { className, style, date, dateFormat, timeFormat, is24Hour } = props;
  const { i18n } = useTranslation();

  const formatted: string | null = useMemo(() => {
    return formatDate(date, {
      language: i18n.language,
      dateFormat,
      timeFormat,
      is24Hour,
    });
  }, [i18n.language, date, dateFormat, timeFormat, is24Hour]);

  return (
    <span className={className} style={style}>
      {formatted}
    </span>
  );
};
