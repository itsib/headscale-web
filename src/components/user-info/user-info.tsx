import { FC } from 'react';
import { User } from '../../types';

export const UserInfo: FC<Omit<User, 'createdAt'> & { size?: number }> = ({ id, name, size = 22 }) => {
  const avatar =  `icon icon-avatar-${Number(id) % 10}`;
  return (
    <div className="flex gap-4 items-center">
      <div className="text-center rounded-full bg-orange-600 bg-opacity-70" style={{ width: size, height: size }}>
        <i className={avatar} style={{ lineHeight: `${size}px`, fontSize: `${size * 0.55}px` }} />
      </div>
      <div className="font-semibold text-lg">{name}</div>
    </div>
  );
};