import { FunctionComponent } from 'preact';
import { useTranslation } from 'react-i18next';
import { ContextMenuBase, UserAction, UserWithProvider } from '@app-types';
import { UserItem } from './_user-item';
import './users-table.css';

export interface DevicesTableProps extends ContextMenuBase<UserAction> {
  users: UserWithProvider[];
  onUserChange: (device: UserWithProvider) => void;
}

export const UsersTable: FunctionComponent<DevicesTableProps> = ({ users, onUserChange, onAction }) => {
  const { t } = useTranslation();

  return (
    <table className="users-table">
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
          <UserItem
            key={user.id}
            onAction={action => {
              onAction(action);
              onUserChange(user);
            }}
            {...user}
          />
        ))}
      </tbody>
    </table>
  );
};