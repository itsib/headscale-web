import { FC } from 'react';
import { User } from '../../types';

export const UserInfo: FC<Pick<User, 'id' | 'name' | 'profilePicUrl'> & { size?: number }> = ({ id, name, profilePicUrl, size = 22 }) => {
  const avatar =  `icon icon-avatar-${Number(id) % 10}`;
  return (
    <div className="flex gap-4 items-center">
      {profilePicUrl ? (
        <div className="text-center rounded-full bg-white overflow-hidden" style={{ width: size, height: size }}>
          <img src={profilePicUrl} alt="avatar" style={{ width: '80%', height: '80%', margin: '3px' }}/>
        </div>
      ) : (
        <div className="text-center rounded-full bg-orange-600 bg-opacity-70 text-white" style={{ width: size, height: size }}>
            <i className={avatar} style={{ lineHeight: `${size}px`, fontSize: `${size * 0.55}px` }}/>
          </div>
        )}
      <div className="font-medium text-lg">{name}</div>
    </div>
  );
};