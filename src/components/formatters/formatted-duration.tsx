import { useMemo } from 'preact/hooks';
import { FunctionComponent, JSX } from 'preact';
import { useTranslation } from 'react-i18next';
import { FormatDurationOpts, formatDuration } from '@app-utils/format-date';

export interface IFormattedDate extends Omit<FormatDurationOpts, 'language'> {
  duration?: string | number;
  className?: string;
  style?: JSX.CSSProperties;
}

export const FormattedDuration: FunctionComponent<IFormattedDate> = ({ duration, style, className, format }) => {
  const { i18n } = useTranslation();

  const formatted: string | null = useMemo(() => {
    return formatDuration(duration, { language: i18n.language, format });
  }, [duration, format, i18n.language]);

  return (
    <span style={style} className={className}>{formatted}</span>
  );
};
