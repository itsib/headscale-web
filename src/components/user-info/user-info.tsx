import { FunctionComponent } from 'preact';
import { UserPhoto, UserPhotoProps } from '@app-components/user-info/user-photo.tsx';
import { Size } from '@app-types';
import { cn } from 'react-just-ui/utils/cn';
import { UserName } from '@app-components/user-info/user-name.tsx';

export interface UserInfoProps extends UserPhotoProps {
  id: string;
  name?: string;
  email?: string;
  displayName?: string;
  pictureUrl?: string;
  size?: Size;
  className?: string;
}

export const UserInfo: FunctionComponent<UserInfoProps> = ({
  id,
  name,
  email,
  displayName,
  pictureUrl,
  size = 'md',
  className,
}) => {
  return (
    <div className={cn('flex gap-4 items-center', className)}>
      <UserPhoto id={id} pictureUrl={pictureUrl} size={size} />

      <UserName name={name} email={email} displayName={displayName} />
    </div>
  );
};
