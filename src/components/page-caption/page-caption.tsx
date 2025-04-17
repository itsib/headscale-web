import { ComponentChild, FunctionComponent } from 'preact';
import { useTranslation } from 'react-i18next';
import { cn } from 'react-just-ui/utils/cn';
import './page-caption.css';

export interface PageCaptionProps {
  title: string | ComponentChild;
  subtitle?: string | ComponentChild;
  actions?: ComponentChild,
  className?: string;
}

export const PageCaption: FunctionComponent<PageCaptionProps> = ({ title, subtitle, actions, className }) => {
  const { t } = useTranslation();
  return (
    <div className={cn('page-caption', className)}>
      <div className="">
        <h1 className="title">{typeof title === 'string' ? t(title) : title}</h1>
        <p className="subtitle">{typeof subtitle === 'string' ? t(subtitle) : subtitle || null}</p>
      </div>

      {actions ? (
        <div className="actions">
          {actions}
        </div>
      ) : null}
    </div>
  );
}