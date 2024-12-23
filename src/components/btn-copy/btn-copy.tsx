import { FC, ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { copyText } from '../../utils/copy-text';

export interface IBtnCopy {
  text?: string;
  tooltip?: string | null;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children?: ReactNode | ((copied: boolean) => ReactNode);
}

export const BtnCopy: FC<IBtnCopy> = ({ text, tooltip = 'copy_to_clipboard', tooltipPosition = 'top', children, className }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className={className ?? 'jj-btn btn-icon'}
      aria-label={tooltip == undefined ? undefined : (copied ? t('copied') : t(tooltip))}
      data-position={tooltipPosition}
      onClick={event => {
        event.stopPropagation();
        if (text) {
          copyText(text).then(() => setCopied(true));
        }
      }}
      onMouseLeave={() => {
        setTimeout(() => setCopied(false), 120);
      }}
    >
      {typeof children === 'function' ? children(copied) : (children || <i className="icon icon-copy"/>)}
    </button>
  );
};
