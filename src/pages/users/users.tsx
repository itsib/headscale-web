import { FC, useEffect, useState } from 'react';
import { useUsers } from '../../hooks/use-users.ts';
import { Trans, useTranslation } from 'react-i18next';
import { ModalUserDelete } from '../../components/modals/modal-user-delete/modal-user-delete.tsx';
import { ModalUserCreate } from '../../components/modals/modal-user-create/modal-user-create.tsx';
import { ModalUserRename } from '../../components/modals/modal-user-rename/modal-user-rename.tsx';
import { User } from '../../types';
import { UserItem } from './_user-item.tsx';
import { ListLoading } from '../../components/skeleton/list-loading.tsx';

export const UsersPage: FC = () => {
  const { t } = useTranslation();
  const { data: users, refetch, isLoading } = useUsers();

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

        <button type="button" className="btn btn-primary flex items-center gap-2" onClick={() => setOpened('create')}>
          <i className="icon icon-user-plus text-lg" />
          <span className="font-semibold"><Trans i18nKey="create_user" /></span>
        </button>
      </div>

      {isLoading ? (
        <ListLoading />
      ) : users?.length ? (
        <table className="w-full table-auto border-spacing-px" border={1}>
          <thead>
          <tr className="border-b border-b-primary h-[50px] text-sm">
            <th className="text-left font-semibold text-secondary uppercase pl-[46px]">{t('user')}</th>
            <th className="text-right font-semibold text-secondary uppercase">{t('joined')}</th>
            <th/>
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
      ) : (
        <div className="border-primary border rounded-md p-8 text-center">
          <Trans i18nKey="empty_list"/>
        </div>
      )}


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