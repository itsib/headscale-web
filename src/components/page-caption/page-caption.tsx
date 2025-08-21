import { ComponentChild, FunctionComponent, createElement } from 'preact';
import { useMemo } from 'preact/hooks';
import { useTranslation } from 'react-i18next';
import { cn } from 'react-just-ui/utils/cn';
import './page-caption.css';

export interface PageCaptionProps {
  title: string | ComponentChild;
  subtitle?: string | ComponentChild;
  actions?: ComponentChild;
  class?: string;
  h?: 1 | 2 | 3 | 4;
}

export const PageCaption: FunctionComponent<PageCaptionProps> = ({
  title,
  subtitle,
  actions,
  class: className,
  h = 1,
}) => {
  const { t } = useTranslation();
  const CustomTag = useMemo(
    () => createElement(`h${h}`, { class: 'title' }, typeof title === 'string' ? t(title) : title),
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
