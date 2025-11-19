import { memo, useMemo } from 'react';
import { AuthKeyWithUser } from '@app-types';
import { FormattedDate } from '@app-components/formatters/formatted-date.tsx';
import { Trans, useTranslation } from 'react-i18next';
import { BtnCopy } from '@app-components/btn-copy/btn-copy.tsx';
import { UserInfo } from '@app-components/user-info/user-info.tsx';
import { FormattedDuration } from '@app-components/formatters/formatted-duration.tsx';
import './-auth-key-item.css';

export type ContextAction = 'expire' | 'delete';

export interface AuthKeyItem extends Omit<AuthKeyWithUser, 'key'> {
  authKey: string;
  onAction: (action: ContextAction) => void;
}

export const AuthKeyItem = memo(function AuthKeyItem(props: AuthKeyItem) {
  const { authKey, user, createdAt, expiration, onAction, reusable, ephemeral } = props;
  const { t } = useTranslation();

  const isExpired = useMemo(() => new Date(expiration).getTime() - Date.now() < 0, [expiration]);

  return (
    <tr className="auth-key-item" style={{ opacity: isExpired ? 0.3 : 1 }}>
      <td className="cell-0">
        <div className="logo">
          <i className="icon icon-keys" />
        </div>
      </td>
      <td className="cell-1">
        <div className="key-wrap">
          <div className="truncate key">{authKey}</div>
          <BtnCopy text={authKey} className="btn-copy" />
        </div>
      </td>
      <td className="text-center">
        <UserInfo {...user} />
      </td>
      <td className="text-center">
        <span>{reusable ? <Trans i18nKey="reusable" /> : <Trans i18nKey="single_use" />}</span>
        {ephemeral ? (
          <span>
            ,<br />
            <Trans i18nKey="ephemeral" />
          </span>
        ) : null}
      </td>
      <td className="text-left lg:pl-10">
        <div className="text-sm text-secondary">
          <FormattedDate date={createdAt} />
        </div>
      </td>
      <td className="text-left">
        <div className="text-sm text-secondary">
          <FormattedDate date={expiration} />
        </div>
        {isExpired ? (
          <div className="text-sm text-danger">
            <Trans i18nKey="expired" />
          </div>
        ) : (
          <div className="text-sm text-secondary">
            <FormattedDuration duration={expiration} />
          </div>
        )}
      </td>
      <td className="cell-action">
        {!isExpired ? (
          <span
            aria-label={t('expire_auth_key')}
            data-position="left"
            className="w-[26px] inline-block text-right"
          >
            <button type="button" className="btn-expire" onClick={() => onAction('expire')}>
              <i className="icon icon-timer-stop" />
            </button>
          </span>
        ) : null}
      </td>
    </tr>
  );
});
