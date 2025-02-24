import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { memo, useEffect, useState } from 'react';
import { User, UserWithProvider } from '@app-types';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { ModalUserCreate } from '@app-components/modals/modal-user-create/modal-user-create';
import { ModalUserRename } from '@app-components/modals/modal-user-rename/modal-user-rename';
import { ModalUserDelete } from '@app-components/modals/modal-user-delete/modal-user-delete';
import { fetchWithContext } from '@app-utils/query-fn';
import { REFRESH_INTERVAL } from '@app-config';
import { useStorage } from '@app-hooks/use-storage';
import { UserInfo } from '@app-components/user-info/user-info.tsx';
import { FormattedDate } from '@app-components/formatters/formatted-date.tsx';
import { ContextMenu } from '@app-components/popups/context-menu.tsx';
import { PopupPlacement } from '@app-components/popups/popup-base/_common.ts';
import { UsersContextMenuAction, UsersContextMenu } from '@app-components/user-context-menu/user-context-menu.tsx';

export const Route = createFileRoute('/_secured/users/')({
  component: Component,
  loader: async ({ context, abortController }) => {
    const data = await fetchWithContext<{ users: UserWithProvider[] }>(
      '/api/v1/user',
      { signal: abortController.signal },
      context.storage,
    );
    return {
      ...data,
      dataUpdatedAt: Date.now(),
    };
  },
  pendingComponent: Pending,
});

function Component() {
  const { t } = useTranslation();
  const storage = useStorage();
  const { users: _users, dataUpdatedAt } = Route.useLoaderData() as { users: UserWithProvider[]; dataUpdatedAt: number };

  const { data: users, refetch } = useQuery({
    queryKey: ['/api/v1/user'],
    queryFn: async ({ queryKey, signal }) => {
      const data = await fetchWithContext<{ nodes: UserWithProvider[] }>(
        queryKey[0] as string,
        { signal },
        storage,
      );
      return data.nodes;
    },
    initialData: _users,
    initialDataUpdatedAt: dataUpdatedAt,
    staleTime: REFRESH_INTERVAL,
    refetchInterval: REFRESH_INTERVAL,
  });

  const [opened, setOpened] = useState<UsersContextMenuAction | null>(null);
  const [selected, setSelected] = useState<User | null>(null);

  useEffect(() => {
    if (selected && !opened) {
      setSelected(null);
    }
  }, [opened, selected]);

  return (
    <div className="pt-6">
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
          className="btn btn-accent flex items-center gap-2"
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

interface UserItemProps extends UserWithProvider {
  onDelete: (user: User) => void;
  onRename: (user: User) => void;
}

const UserItem = memo(function UserItem(props: UserItemProps) {
  const { id, name, displayName, email, provider, profilePicUrl, createdAt, onDelete, onRename } = props
  return (
    <tr className="h-[60px] border-b border-b-primary">
      <td>
        <UserInfo id={id} className="font-medium text-lg" name={name} displayName={displayName} pictureUrl={profilePicUrl} size={30} />
      </td>
      <td>
        <span className="text-secondary font-normal">{email}</span>
      </td>
      <td className="text-center">
        {provider === 'oidc' ? (
          <img src="/images/google-account.svg" alt="google" className="h-[32px] w-auto inline-block" />
        ) : null}
      </td>
      <td className="text-right">
        <FormattedDate iso={createdAt}  hourCycle="h24" dateStyle="medium" timeStyle="medium" />
      </td>
      <td className="text-right w-[52px]">
        <ContextMenu
          placement={PopupPlacement.BOTTOM}
          menu={() => (
            <UsersContextMenu onClick={action => {
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