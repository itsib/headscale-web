import { memo } from 'preact/compat';
import { Trans } from 'react-i18next';
import './empty-list.css';

export const EmptyList = memo(function EmptyList() {
  return (
    <div className="empty-list">
      <img src="/images/empty-box.svg" alt="empty" width="80" height="80" />
      <div className="message">
        <Trans i18nKey="empty_list"/>
      </div>
    </div>
  );
})