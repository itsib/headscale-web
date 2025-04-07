import { useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { User, UserAction, UserWithProvider } from '@app-types';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { ModalUserCreate } from '@app-components/modals/modal-user-create/modal-user-create';
import { ModalUserRename } from '@app-components/modals/modal-user-rename/modal-user-rename';
import { ModalUserDelete } from '@app-components/modals/modal-user-delete/modal-user-delete';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group';
import { useBreakPoint } from '@app-hooks/use-break-point';
import { UsersList } from '@app-components/users-list';
import { EmptyList } from '@app-components/empty-list/empty-list.tsx';
import './users.css';

export function Users() {
  const { t } = useTranslation();

  const [opened, setOpened] = useState<UserAction | null>(null);
  const [selected, setSelected] = useState<User | null>(null);

  const isMobile = useBreakPoint(992);
  const [_isListLayout, setIsListLayout] = useState(true);
  const isListLayout = !isMobile && _isListLayout;

  const { data: users, refetch, isLoading } = useQuery<{ users: UserWithProvider[] }, Error, UserWithProvider[]>({
    queryKey: ['/api/v1/user', 'GET'],
    select: data => data.users,
    staleTime: 60_000 * 60,
    refetchInterval: 30_000,
  });

  const buttons: ButtonConfig[] = useMemo(() => {
    const buttons = isMobile ? [] : [
      {
        id: 'set-layout',
        icon: isListLayout ? 'icon-layout-cards' : 'icon-layout-list',
        tooltip: t('layout_change'),
        effect: 'icon-shake',
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
        <UsersList layout={isListLayout ? 'table' : 'cards'} users={users} onAction={setOpened} onChange={setSelected} />
      ) : (
        <EmptyList />
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
