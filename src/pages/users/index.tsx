import { useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { memo } from 'preact/compat';
import { User, UserWithProvider } from '@app-types';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { ModalUserCreate } from '@app-components/modals/modal-user-create/modal-user-create';
import { ModalUserRename } from '@app-components/modals/modal-user-rename/modal-user-rename';
import { ModalUserDelete } from '@app-components/modals/modal-user-delete/modal-user-delete';
import { fetchWithContext } from '@app-utils/query-fn';
import { useStorage } from '@app-hooks/use-storage';
import { UserInfo } from '@app-components/user-info/user-info';
import { FormattedDate } from '@app-components/formatters/formatted-date';
import { ContextMenu } from '@app-components/popups/context-menu';
import { PopupPlacement } from '@app-components/popups/base-popup/base-popup';
import { UsersContextMenu, UsersContextMenuAction } from '@app-components/user-context-menu/user-context-menu';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group';

export function Users() {
  const { t } = useTranslation();
  const storage = useStorage();

  const [opened, setOpened] = useState<UsersContextMenuAction | null>(null);
  const [selected, setSelected] = useState<User | null>(null);

  const { data: users, refetch, isLoading } = useQuery({
    queryKey: ['/api/v1/user', 'GET'],
    queryFn: async ({ queryKey, signal }) => {
      const data = await fetchWithContext<{ users: UserWithProvider[] }>(
        queryKey[0] as string,
        { signal, method: queryKey[1] },
        storage,
      );
      return data.users;
    },
    staleTime: 20_000,
    refetchInterval: 15_000,
  });

  const buttons: ButtonConfig[] = useMemo(() => {
    return [
      {
        id: 'refresh-devices',
        icon: 'icon-refresh',
        tooltip: t('refresh_devices'),
        effect: 'icon-spin',
      },
      {
        id: 'create-user',
        icon: 'icon-user-plus',
        tooltip: t('create_user'),
        effect: 'icon-shake',
      },
    ];
  }, [t]);

  async function onClick(id: string) {
    switch (id) {
      case 'create-user':
        return setOpened('create');
      case 'refresh-users':
        return refetch();
    }
  }

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

        <ButtonGroup buttons={buttons} onClick={onClick} />
      </div>

      {isLoading ? (
        <ListLoading />
      ) : users?.length ? (
        <table className="w-full table-auto border-spacing-px ">
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
          Menu={() => (
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