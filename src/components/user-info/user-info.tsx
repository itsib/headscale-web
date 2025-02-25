import { RenderableProps } from 'preact';

export interface UserInfoProps {
  id: string;
  name?: string;
  displayName?: string;
  pictureUrl?: string;
  size?: number;
  className?: string;
}

export const UserInfo = ({ id, name, displayName, pictureUrl, size = 22, className }: RenderableProps<UserInfoProps>) => {
  const avatar = !pictureUrl ? `icon icon-avatar-${Number(id) % 10}` : '';

  return (
    <div className={`flex gap-4 items-center ${className}`}>
      {pictureUrl ? (
        <div className="text-center rounded-full bg-transparent overflow-hidden" style={{ width: size, height: size }}>
          <img src={pictureUrl} alt="avatar" style={{ width: '100%', height: '100%' }}/>
        </div>
      ) : (
        <div className="text-center rounded-full bg-orange-600 bg-opacity-70 text-white" style={{ width: size, height: size }}>
          <i className={avatar} style={{ lineHeight: `${size}px`, fontSize: `${size * 0.55}px` }}/>
        </div>
      )}
      {displayName && name ? (
        <div className="text-start">
          <div className="text-base">{name}</div>
          <div className="text-secondary text-xs">{displayName}</div>
        </div>
      ) : (
        <div className="text-start">
          <div className="text-base">{name || displayName}</div>
          <div className="text-secondary text-xs">&nbsp;</div>
        </div>
      )}
    </div>
  );
};