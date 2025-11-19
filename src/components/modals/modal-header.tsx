import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

export interface ModalHeaderProps {
  caption: string;
  onDismiss: () => void;
}

export const ModalHeader: FC<ModalHeaderProps> = ({ caption, onDismiss }) => {
  const { t } = useTranslation();

  return (
    <div className="modal-header">
      <div className="title">
        <span>{t(caption)}</span>
      </div>
      <button type="button" className="btn btn-close" onClick={() => onDismiss()} />
    </div>
  );
};
