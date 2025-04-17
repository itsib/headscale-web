import { FunctionComponent } from 'preact';
import { cn } from 'react-just-ui/utils/cn';
import './user-name.css';

export interface UserNameProps {
  name?: string;
  displayName?: string;
  className?: string;
}

export const UserName: FunctionComponent<UserNameProps> = ({ name, displayName, className }) => {
  return name && displayName ? (
    <div className={cn('user-name', className)}>
      <div>{name}</div>
      <div className="display-name">{displayName}</div>
    </div>
  ) : (
    <div className={cn('user-name', className)}>
      <div>{name || displayName}</div>
      <div className="display-name">&nbsp;</div>
    </div>
  );
}