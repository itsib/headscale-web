import { memo, useMemo } from 'react';
import { AuthKeyWithUser } from '../../types';
import { FormattedDate } from '../../components/formatters/formatted-date.tsx';
import { Trans, useTranslation } from 'react-i18next';
import { BtnCopy } from '../../components/btn-copy/btn-copy.tsx';
import { UserInfo } from '../../components/user-info/user-info.tsx';
import { FormattedDuration } from '../../components/formatters/formatted-duration.tsx';

export type ContextAction = 'expire' | 'delete';

export interface AuthKeyItem extends Omit<AuthKeyWithUser, 'key'> {
  authKey: string;
  onAction: (action: ContextAction) => void;
}

export const AuthKeyItem = memo(function AuthKeyItem(props: AuthKeyItem) {
  const { authKey, user, createdAt, expiration, onAction, reusable, ephemeral } = props;
  const { t } = useTranslation();

  const isExpired = useMemo(() => (new Date(expiration).getTime() - Date.now()) < 0, [expiration]);

  return (
    <tr className={`h-[60px] border-b border-b-primary ${isExpired ? 'opacity-30' : ''}`}>
      <td className="w-[60px]">
        <div className="w-[36px] h-[36px] rounded-full bg-green-700 bg-opacity-70 text-center">
          <i className="icon icon-keys text-[18px] leading-[36px]"/>
        </div>
      </td>
      <td >
        <div className="flex items-center">
          <div className="truncate max-w-[100px] text-end" style={{ direction: 'rtl' }}>{authKey}</div>
          <BtnCopy text={authKey} className="m-3"/>
        </div>
      </td>
      <td className="text-center">
        <UserInfo {...user} />
      </td>
      <td className="text-center">
        <span>{reusable ? <Trans i18nKey="reusable" /> : <Trans i18nKey="single_use" />}</span>
        {ephemeral ? <span>,<br/><Trans i18nKey="ephemeral" /></span> : null}
      </td>
      <td className="text-left lg:pl-10">
        <div className="text-sm text-secondary">
          <FormattedDate iso={createdAt} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
        </div>
      </td>
      <td className="text-left">
        <div className="text-sm text-secondary">
          <FormattedDate iso={expiration} hourCycle="h24" dateStyle="medium" timeStyle="medium"/>
        </div>
        {isExpired ? (
          <div className="text-sm text-red-500">
            <Trans i18nKey="expired" />
          </div>
        ) : (
          <div className="text-sm text-secondary">
            <FormattedDuration iso={expiration} format="long"/>
          </div>
        )}
      </td>
      <td className="text-right w-[52px]">
        {!isExpired ? (
          <div aria-label={t('expire_auth_key')} data-position="top" className="w-[26px] inline-block text-right">
            <button
              type="button"
              className="text-stone-600 opacity-90 relative top-[2px] transition hover:opacity-60 hover:text-accent active:opacity-90"
              onClick={() => onAction('expire')}
            >
              <i className="icon icon-expire text-[24px]"/>
            </button>
          </div>
        ) : null}
      </td>
    </tr>
  );
});
