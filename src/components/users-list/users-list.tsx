import type { FC } from 'react';
import { ContextMenuBase, UserAction, User } from '@app-types';
import { useTranslation } from 'react-i18next';
import { UserTableRow } from './_user-table-row';
import { UserCard } from './_user-card';
import './users-list.css';

export interface UsersListProps extends ContextMenuBase<UserAction> {
  layout: 'table' | 'cards';
  users: User[];
  onChange: (device: User) => void;
}

export const UsersList: FC<UsersListProps> = ({ users, layout, onChange, onAction }) => {
  const { t } = useTranslation();

  return (
    <div className="users-list">
      {layout === 'table' ? (
        <table className="table-layout">
          <thead>
            <tr>
              <th scope="col">{t('user')}</th>
              <th scope="col">{t('email')}</th>
              <th scope="col">{t('provider')}</th>
              <th scope="col">{t('joined')}</th>
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <UserTableRow
                key={user.id}
                onAction={(action) => {
                  onAction(action);
                  onChange(user);
                }}
                {...user}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="cards-layout">
          {users.map((user: User) => (
            <UserCard
              key={user.id}
              onAction={(action) => {
                onAction(action);
                onChange(user);
              }}
              {...user}
            />
          ))}
        </div>
      )}
    </div>
  );
};
