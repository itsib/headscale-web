import { User } from '../../types';
import { memo } from 'react';
import { UserInfo } from '../../components/user-info/user-info.tsx';
import { FormattedDate } from '../../components/formatters/formatted-date.tsx';
import { ContextMenu } from '../../components/popups/context-menu.tsx';
import { PopupPlacement } from '../../components/popups/popup-base/_common.ts';
import { UserMenu } from './_user-menu.tsx';

export interface UserItemProps extends User {
  onDelete: (user: User) => void;
  onRename: (user: User) => void;
}

export const UserItem = memo(function UserItem(props: UserItemProps) {
  const { id, name, displayName, email, profilePicUrl, createdAt, onDelete, onRename } = props
  return (
    <tr className="h-[60px] border-b border-b-primary">
      <td>
        <UserInfo id={id} name={displayName || name} profilePicUrl={profilePicUrl} size={30} />
      </td>
      <td className="text-right">
        <FormattedDate iso={createdAt}  hourCycle="h24" dateStyle="medium" timeStyle="medium" />
      </td>
      <td className="text-right w-[52px]">
        <ContextMenu
          placement={PopupPlacement.BOTTOM}
          menu={() => (
            <UserMenu onClick={action => {
              if (action === 'rename') {
                onRename({ id, name, displayName, profilePicUrl, email, createdAt });
              } else if (action === 'delete') {
                onDelete({ id, name, displayName, profilePicUrl, email, createdAt });
              }
            }} />
          )}
        >
          <button
            type="button"
            className="text-neutral-300 dark:text-neutral-600 opacity-90 relative top-[2px] transition hover:opacity-60 hover:text-accent active:opacity-90"
          >
            <i className="icon icon-context-menu text-[24px]"/>
          </button>
        </ContextMenu>
      </td>
    </tr>
  );
});
