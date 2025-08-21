import { memo, useMemo } from 'react';
import { AuthKeyWithUser } from '@app-types';
import { FormattedDate } from '@app-components/formatters/formatted-date.tsx';
import { Trans, useTranslation } from 'react-i18next';
import { BtnCopy } from '@app-components/btn-copy/btn-copy.tsx';
import { UserInfo } from '@app-components/user-info/user-info.tsx';
import { FormattedDuration } from '@app-components/formatters/formatted-duration.tsx';
import './_auth-key-item.css';

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
    <tr class="auth-key-item" style={{ opacity: isExpired ? '0.3' : null }}>
      <td class="cell-0">
        <div class="logo">
          <i class="icon icon-keys" />
        </div>
      </td>
      <td class="cell-1">
        <div class="key-wrap">
          <div class="truncate key">{authKey}</div>
          <BtnCopy text={authKey} className="btn-copy" />
        </div>
      </td>
      <td class="text-center">
        <UserInfo {...user} />
      </td>
      <td class="text-center">
        <span>{reusable ? <Trans i18nKey="reusable" /> : <Trans i18nKey="single_use" />}</span>
        {ephemeral ? (
          <span>
            ,<br />
            <Trans i18nKey="ephemeral" />
          </span>
        ) : null}
      </td>
      <td class="text-left lg:pl-10">
        <div class="text-sm text-secondary">
          <FormattedDate date={createdAt} />
        </div>
      </td>
      <td class="text-left">
        <div class="text-sm text-secondary">
          <FormattedDate date={expiration} />
        </div>
        {isExpired ? (
          <div class="text-sm text-danger">
            <Trans i18nKey="expired" />
          </div>
        ) : (
          <div class="text-sm text-secondary">
            <FormattedDuration duration={expiration} />
          </div>
        )}
      </td>
      <td class="cell-action">
        {!isExpired ? (
          <span
            aria-label={t('expire_auth_key')}
            data-position="left"
            class="w-[26px] inline-block text-right"
          >
            <button type="button" class="btn-expire" onClick={() => onAction('expire')}>
              <i class="icon icon-timer-stop" />
            </button>
          </span>
        ) : null}
      </td>
    </tr>
  );
});
