import { FunctionComponent } from 'preact';
import { ContextMenuBase, UserAction, UserWithProvider } from '@app-types';
import { useTranslation } from 'react-i18next';
import { UserTableRow } from './_user-table-row';
import { UserCard } from './_user-card';
import './users-list.css';

export interface UsersListProps extends ContextMenuBase<UserAction> {
  layout: 'table' | 'cards';
  users: UserWithProvider[];
  onChange: (device: UserWithProvider) => void;
}

export const UsersList: FunctionComponent<UsersListProps> = ({ users, layout, onChange, onAction }) => {
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
            <th scope="col"/>
          </tr>
          </thead>
          <tbody>
          {users?.map((user) => (
            <UserTableRow
              key={user.id}
              onAction={action => {
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
          {users.map((user: UserWithProvider) => (
            <UserCard
              key={user.id}
              onAction={action => {
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