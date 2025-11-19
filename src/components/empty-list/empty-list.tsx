import { useTranslation } from 'react-i18next';
import type { FC } from 'react';
import './empty-list.css';

export const EmptyList: FC<{ message?: string }> = ({ message }) => {
  const { t } = useTranslation();

  return (
    <div className="empty-list">
      <img src="/images/empty-box.svg" alt="empty" width="80" height="80" />
      <div className="message">{t(message || 'empty_list')}</div>
    </div>
  );
};
