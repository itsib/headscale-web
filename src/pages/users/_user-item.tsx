import { User } from '../../types';
import { memo, useRef } from 'react';
import { UserInfo } from '../../components/user-info/user-info.tsx';
import { FormattedDate } from '../../components/formatters/formatted-date.tsx';
import { ContextMenu } from '../../components/popups/context-menu.tsx';
import { PopupPlacement } from '../../components/popups/popup-base/_common.ts';
import { Trans } from 'react-i18next';

export interface UserItemProps extends User {
  onDelete: (user: User) => void;
  onRename: (user: User) => void;
}

export const UserItem = memo(function UserItem({ id, name, createdAt, onDelete, onRename }: UserItemProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <tr className="h-[60px] border-b border-b-primary">
      <td>
        <UserInfo id={id} name={name} size={30} />
      </td>
      <td className="text-right">
        <FormattedDate iso={createdAt}  hourCycle="h24" dateStyle="medium" timeStyle="medium" />
      </td>
      <td className="text-right w-[52px]">
        <button
          type="button"
          className="text-neutral-300 dark:text-neutral-600 opacity-90 relative top-[2px] transition hover:opacity-60 hover:text-accent active:opacity-90"
          ref={btnRef}
        >
          <i className="icon icon-context-menu text-[24px]" />
        </button>

        <ContextMenu btnOpenRef={btnRef} placement={PopupPlacement.BOTTOM}>
          <div className="context-menu-item">
            <button type="button" className="btn-context-menu" onClick={() => onRename({ id, name, createdAt })}>
              <Trans i18nKey="rename"/>
            </button>
          </div>
          <hr className="context-menu-divider" />
          <div className="context-menu-item">
            <button type="button" className="btn-context-menu text-red-600"  onClick={() => onDelete({ id, name, createdAt })}>
              <Trans i18nKey="delete"/>
            </button>
          </div>
        </ContextMenu>
      </td>
    </tr>
  );
});
