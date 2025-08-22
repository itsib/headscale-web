import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { User, UserAction } from '@app-types';
import { ListLoading } from '@app-components/skeleton/list-loading';
import { ModalUserCreate } from '@app-components/modals/modal-user-create/modal-user-create';
import { ModalUserRename } from '@app-components/modals/modal-user-rename/modal-user-rename';
import { ModalUserDelete } from '@app-components/modals/modal-user-delete/modal-user-delete';
import { ButtonConfig, ButtonGroup } from '@app-components/button-group/button-group';
import { useBreakPoint } from '@app-hooks/use-break-point';
import { UsersList } from '@app-components/users-list';
import { EmptyList } from '@app-components/empty-list/empty-list';
import { PageCaption } from '@app-components/page-caption/page-caption';
import './users.css';

export function UsersPage() {
  const { t } = useTranslation();

  const [opened, setOpened] = useState<UserAction | null>(null);
  const [selected, setSelected] = useState<User | null>(null);

  const isMobile = useBreakPoint(992);
  const [_isListLayout, setIsListLayout] = useState(true);
  const isListLayout = !isMobile && _isListLayout;

  const {
    data: users,
    refetch,
    isLoading,
  } = useQuery<{ users: User[] }, Error, User[]>({
    queryKey: ['/api/v1/user', 'GET'],
    select: (data) => data.users,
    staleTime: 60_000 * 60,
    refetchInterval: 30_000,
  });

  const buttons: ButtonConfig[] = useMemo(() => {
    const buttons = isMobile
      ? []
      : [
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
        return setIsListLayout((value) => !value);
    }
  }

  function onDismiss() {
    setOpened(null);
  }

  useEffect(() => {
    if (selected && !opened) {
      setSelected(null);
    }
  }, [opened, selected]);

  return (
    <div className="page users-page">
      <PageCaption
        title="users"
        subtitle="users_page_subtitle"
        actions={<ButtonGroup buttons={buttons} onClick={onClick} />}
      />

      {isLoading ? (
        <ListLoading />
      ) : users?.length ? (
        <UsersList
          layout={isListLayout ? 'table' : 'cards'}
          users={users}
          onAction={setOpened}
          onChange={setSelected}
        />
      ) : (
        <EmptyList />
      )}

      <ModalUserCreate isOpen={opened === 'create'} onDismiss={onDismiss} />
      <ModalUserRename user={selected} isOpen={opened === 'rename'} onDismiss={onDismiss} />
      <ModalUserDelete user={selected} isOpen={opened === 'delete'} onDismiss={onDismiss} />
    </div>
  );
}
