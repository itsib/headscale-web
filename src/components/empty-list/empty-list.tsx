import { useTranslation } from 'react-i18next';
import './empty-list.css';
import { FunctionComponent } from 'preact';

export const EmptyList: FunctionComponent<{ message?: string }> = ({ message }) => {
  const { t } = useTranslation();

  return (
    <div className="empty-list">
      <img src="/images/empty-box.svg" alt="empty" width="80" height="80" />
      <div className="message">{t(message || 'empty_list')}</div>
    </div>
  );
};
