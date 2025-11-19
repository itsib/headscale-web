import { ReactNode, FC, createElement } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from 'react-just-ui/utils/cn';
import './page-caption.css';

export interface PageCaptionProps {
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  actions?: ReactNode;
  className?: string;
  h?: 1 | 2 | 3 | 4;
}

export const PageCaption: FC<PageCaptionProps> = ({
  title,
  subtitle,
  actions,
  className,
  h = 1,
}) => {
  const { t } = useTranslation();
  const CustomTag = useMemo(
    () =>
      createElement(`h${h}`, { className: 'title' }, typeof title === 'string' ? t(title) : title),
    [h]
  );

  return (
    <div className={cn('page-caption', className)}>
      <div className="">
        {CustomTag}
        <p className="subtitle">{typeof subtitle === 'string' ? t(subtitle) : subtitle || null}</p>
      </div>

      {actions ? <div className="actions">{actions}</div> : null}
    </div>
  );
};
