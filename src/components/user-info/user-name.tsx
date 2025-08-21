import { FunctionComponent } from 'preact';
import { cn } from 'react-just-ui/utils/cn';
import './user-name.css';

export interface UserNameProps {
  name?: string;
  email?: string;
  displayName?: string;
  className?: string;
}

export const UserName: FunctionComponent<UserNameProps> = ({
  name,
  email,
  displayName,
  className,
}) => {
  return email ? (
    <div className={cn('user-name', className)}>
      <div>{email}</div>
      {name || displayName ? (
        <div className="display-name">{name || displayName}</div>
      ) : (
        <div className="display-name">&nbsp;</div>
      )}
    </div>
  ) : (
    <div className={cn('user-name', className)}>
      <div>{name || displayName}</div>
      {name && displayName ? (
        <div className="display-name">{displayName}</div>
      ) : (
        <div className="display-name">&nbsp;</div>
      )}
    </div>
  );
};
