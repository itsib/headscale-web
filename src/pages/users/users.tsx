import { useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { User, UserAction, UserWithProvider } from '@app-types';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { ModalUserCreate } from '@app-components/modals/modal-user-create/modal-user-create';
import { ModalUserRename } from '@app-components/modals/modal-user-rename/modal-user-rename';
import { ModalUserDelete } from '@app-components/modals/modal-user-delete/modal-user-delete';
import { fetchWithContext } from '@app-utils/query-fn';
import { useStorage } from '@app-hooks/use-storage';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group';
import { UsersTable } from '@app-components/users-table';
import { useBreakPoint } from '@app-hooks/use-break-point';
import './users.css';
import { UsersCards } from '@app-components/users-cards/users-cards.tsx';

export function Users() {
  const { t } = useTranslation();
  const storage = useStorage();

  const [opened, setOpened] = useState<UserAction | null>(null);
  const [selected, setSelected] = useState<User | null>(null);

  const isMobile = useBreakPoint(992);
  const [_isListLayout, setIsListLayout] = useState(true);
  const isListLayout = !isMobile && _isListLayout;

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
    const buttons = isMobile ? [] : [
      {
        id: 'set-layout',
        icon: isListLayout ? 'icon-layout-cards' : 'icon-layout-list',
        tooltip: t('layout_change'),
        effect: 'icon-flip',
      },
    ];

    return [
      ...buttons,
      {
        id: 'refresh-users',
        icon: 'icon-refresh',
        tooltip: t('refresh_users'),
        effect: 'icon-spin',
      },
      {
        id: 'create-user',
        icon: 'icon-add-user',
        tooltip: t('create_user'),
        effect: 'icon-shake',
      },
    ];
  }, [t, isMobile, isListLayout]);

  async function onClick(id: string) {
    switch (id) {
      case 'create-user':
        return setOpened('create');
      case 'refresh-users':
        return refetch();
      case 'set-layout':
        return setIsListLayout(value => !value);
    }
  }

  useEffect(() => {
    if (selected && !opened) {
      setSelected(null);
    }
  }, [opened, selected]);

  return (
    <div className="users-page">
      <div className="caption">
        <div className="">
          <h1 className="mb-2">
            <Trans i18nKey="users" />
          </h1>
          <p className="text-secondary">
            <Trans i18nKey="users_page_subtitle" />
          </p>
        </div>

        <div className="actions">
          <ButtonGroup buttons={buttons} onClick={onClick} />
        </div>
      </div>

      {isLoading ? (
        <ListLoading />
      ) : users?.length ? (
        <>
          {isListLayout ? (
            <UsersTable users={users} onAction={setOpened} onUserChange={setSelected} />
          ) : (
            <UsersCards users={users} onAction={setOpened} onUserChange={setSelected} />
          )}
        </>
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
