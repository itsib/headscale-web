import { memo } from 'preact/compat';
import { useMemo } from 'preact/hooks';
import { ContextMenuBase, User, UserAction } from '@app-types';
import { useTranslation } from 'react-i18next';
import { ContextMenu } from './_context-menu';
import { UserInfo } from '@app-components/user-info/user-info';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import './_user-card.css';

type UserCardProps = ContextMenuBase<UserAction> & User;

export const UserCard = memo(function UserItem(props: UserCardProps) {
  const { id, name, displayName, email, provider, providerId, profilePicUrl, createdAt, onAction } =
    props;
  const { t } = useTranslation();

  const account = useMemo(() => {
    if (provider !== 'oidc') {
      return null;
    }
    if (providerId.includes('google')) {
      return 'Google';
    }
    return 'Other';
  }, [provider, providerId]);

  return (
    <div className="user-card">
      <div className="main-info">
        <UserInfo
          id={id}
          className="font-medium text-lg"
          name={name}
          displayName={displayName}
          pictureUrl={profilePicUrl}
        />

        <ContextMenu onAction={onAction} />
      </div>

      <div className="info-row">
        <div className="label">{t('email')}:</div>
        <div className="value">{email}</div>
      </div>

      {provider === 'oidc' ? (
        <div className="info-row">
          <div className="label">{t('account')}:</div>
          <div className="value">{account}</div>
        </div>
      ) : null}

      <div className="info-row">
        <div className="label">{t('joined')}:</div>
        <div className="value">
          <FormattedDate date={createdAt} />
        </div>
      </div>
    </div>
  );
});
