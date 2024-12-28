import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { User, UserWithProvider } from '../../../types';
import { ListLoading } from '../../../components/skeleton/list-loading.tsx';
import { UserItem } from './-user-item.tsx';
import { ModalUserCreate } from '../../../components/modals/modal-user-create/modal-user-create.tsx';
import { ModalUserRename } from '../../../components/modals/modal-user-rename/modal-user-rename.tsx';
import { ModalUserDelete } from '../../../components/modals/modal-user-delete/modal-user-delete.tsx';
import { fetchWithContext } from '../../../utils/query-fn.ts';
import { ContextAction } from './-user-menu.tsx';

export const Route = createFileRoute('/_secured/users/')({
  component: Component,
  loader: ({ context, abortController }) => {
    return fetchWithContext(
      '/api/v1/user',
      { signal: abortController.signal },
      context.storage,
    );
  },
  pendingComponent: Pending,
});

function Component() {
  const { t } = useTranslation();
  const { users } = Route.useLoaderData() as { users: UserWithProvider[] };
  const { invalidate } = useRouter();

  const [opened, setOpened] = useState<ContextAction | null>(null);
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
          <h1 className="mb-2">
            <Trans i18nKey="users" />
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="users_page_subtitle" />
          </p>
        </div>

        <button
          type="button"
          className="jj-btn btn-accent flex items-center gap-2"
          onClick={() => setOpened('create')}
        >
          <i className="icon icon-user-plus text-lg text-white" />
          <span className="font-semibold text-white">
            <Trans i18nKey="create_user" />
          </span>
        </button>
      </div>

      {users?.length ? (
        <table className="w-full table-auto border-spacing-px " border={1}>
          <thead>
            <tr className="border-b border-b-primary h-[30px] text-xs font-medium text-secondary uppercase">
              <th className="text-left pl-[46px]">{t('user')}</th>
              <th className="text-left">{t('email')}</th>
              <th className="text-center">{t('provider')}</th>
              <th className="text-right">{t('joined')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <UserItem
                key={user.id}
                onDelete={(user) => {
                  setSelected(user);
                  setOpened('delete');
                }}
                onRename={(user) => {
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
          <Trans i18nKey="empty_list" />
        </div>
      )}

      <ModalUserCreate
        isOpen={opened === 'create'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => invalidate()}
      />
      <ModalUserRename
        user={selected}
        isOpen={opened === 'rename'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => invalidate()}
      />
      <ModalUserDelete
        user={selected}
        isOpen={opened === 'delete'}
        onDismiss={() => setOpened(null)}
        onSuccess={() => invalidate()}
      />
    </div>
  );
}

function Pending() {
  useTranslation();
  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="mb-2">
            <Trans i18nKey="users" />
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="users_page_subtitle" />
          </p>
        </div>
      </div>

      <ListLoading />
    </div>
  );
}
