import { FC, memo, useEffect, useRef, useState } from 'react';
import { useUsers } from '../../hooks/use-users.ts';
import { Trans, useTranslation } from 'react-i18next';
import { User } from '../../types';
import { Avatar } from 'react-just-ui';
import { FormattedDate } from '../../components/formatters/formatted-date.tsx';
import { ContextMenu } from '../../components/popups/context-menu.tsx';
import { PopupPlacement } from '../../components/popups/popup-base/_common.ts';
import { ModalUserDelete } from '../../components/modals/modal-user-delete/modal-user-delete.tsx';
import { ModalUserCreate } from '../../components/modals/modal-user-create/modal-user-create.tsx';
import { ModalUserRename } from '../../components/modals/modal-user-rename/modal-user-rename.tsx';
import { getAvatarUrl } from '../../utils/get-avatar-url.ts';

export const UsersPage: FC = () => {
  const { t } = useTranslation();
  const { data: users, refetch } = useUsers();

  const [opened, setOpened] = useState<'delete' | 'create' | 'rename' | null>(null);
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    if (selected && !opened) {
      setSelected(null);
    }

  }, [opened, selected]);

  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2"><Trans i18nKey="users"/></h1>
          <p className="text-secondary"><Trans i18nKey="users_page_subtitle"/></p>
        </div>

        <button type="button" className="btn-primary" onClick={() => setOpened('create')}>
          <i className="icon icon-user-plus text-lg" />
          <span><Trans i18nKey="create_user" /></span>
        </button>
      </div>

      <table className="w-full table-auto border-spacing-px" border={1}>
        <thead>
        <tr className="border-b border-b-primary h-[50px] text-sm">
          <th className="text-left font-semibold text-secondary uppercase">{t('user')}</th>
          <th className="text-right font-semibold text-secondary uppercase">{t('joined')}</th>
          <th />
        </tr>
        </thead>
        <tbody>
        {users?.map(user => (
          <UserItem
            key={user.id}
            onDelete={user => {
              setSelected(user);
              setOpened('delete');
            }}
            onRename={user => {
              setSelected(user);
              setOpened('rename');
            }}
            {...user}
          />
        ))}
        </tbody>
      </table>

      <ModalUserCreate
        isOpen={opened === 'create'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalUserRename
        user={selected}
        isOpen={opened === 'rename'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
      <ModalUserDelete
        user={selected}
        isOpen={opened === 'delete'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

interface UserItemProps extends User {
  onDelete: (user: User) => void;
  onRename: (user: User) => void;
}

const UserItem = memo(function UserItem({ id, name, createdAt, onDelete, onRename }: UserItemProps) {
  const btnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <tr className="h-[60px] border-b border-b-primary">
      <td>
        <div className="flex items-center">
          <Avatar src={getAvatarUrl(id)} alt={name} size={30} />

          <div className="font-bold text-lg ml-4">{name}</div>
        </div>
      </td>
      <td className="text-right">
        <FormattedDate iso={createdAt}  hourCycle="h24" dateStyle="medium" timeStyle="medium" />
      </td>
      <td className="text-right w-[52px]">
        <button
          type="button"
          className="text-stone-600 opacity-90 relative top-[2px] transition hover:opacity-60 hover:text-accent active:opacity-90"
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
})