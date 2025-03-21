import { memo } from 'react';
import { UserInfo } from '@app-components/user-info/user-info';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import { UsersContextMenu } from './_user-context-menu';
import { ContextMenuBase, UserAction, UserWithProvider } from '@app-types';

export type UserTableRowProps = UserWithProvider & ContextMenuBase<UserAction>;

export const UserTableRow = memo(function UserItem(props: UserTableRowProps) {
  const { id, name, displayName, email, provider, profilePicUrl, createdAt, onAction } = props
  return (
    <tr className="user-table-row">
      <td>
        <UserInfo id={id} className="font-medium text-lg" name={name} displayName={displayName} pictureUrl={profilePicUrl} size={30} />
      </td>
      <td>
        <span className="text-secondary font-normal">{email}</span>
      </td>
      <td>
        {provider === 'oidc' ? (
          <img src="/images/google-account.svg" alt="google" className="h-[32px] w-auto inline-block" />
        ) : null}
      </td>
      <td>
        <FormattedDate iso={createdAt}  hourCycle="h24" dateStyle="medium" timeStyle="medium" />
      </td>
      <td className="text-right w-[52px]">
        <UsersContextMenu onAction={onAction} />
      </td>
    </tr>
  );
});