import { memo } from 'react';
import { UserInfo } from '@app-components/user-info/user-info';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import { ContextMenu } from './_context-menu';
import { ContextMenuBase, UserAction, User } from '@app-types';
import './_user-table-row.css';

export type UserTableRowProps = User & ContextMenuBase<UserAction>;

export const UserTableRow = memo(function UserItem(props: UserTableRowProps) {
  const { id, name, displayName, email, provider, profilePicUrl, createdAt, onAction } = props;
  return (
    <tr className="user-table-row">
      <td>
        <UserInfo
          id={id}
          className="font-medium text-lg"
          name={name}
          displayName={displayName}
          pictureUrl={profilePicUrl}
          size="lg"
        />
      </td>
      <td>
        <span className="text-secondary font-normal">{email}</span>
      </td>
      <td>
        {provider === 'oidc' ? (
          <img
            src="/images/google-account.svg"
            alt="google"
            style="height: 32px;"
            className=" inline-block"
          />
        ) : null}
      </td>
      <td>
        <FormattedDate date={createdAt} />
      </td>
      <td className="text-right" style="width: 52px;">
        <ContextMenu onAction={onAction} />
      </td>
    </tr>
  );
});
