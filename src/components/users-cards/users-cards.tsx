import { FunctionComponent } from 'preact';
import { ContextMenuBase, UserAction, UserWithProvider } from '@app-types';
import { UserItem } from './_user-item';
import './users-cards.css';

export interface UsersCardsProps  extends ContextMenuBase<UserAction> {
  users: UserWithProvider[];
  onUserChange: (device: UserWithProvider) => void;
}

export const UsersCards: FunctionComponent<UsersCardsProps> = ({ users, onUserChange, onAction }) => {
  return (
    <div className="users-cards">
      {users.map((user: UserWithProvider) => (
        <UserItem
          key={user.id}
          onAction={action => {
            onAction(action);
            onUserChange(user);
          }}
          {...user}
        />
      ))}
    </div>
  );
}