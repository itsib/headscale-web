import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';

export interface UserInfoProps {
  id: string;
  name?: string;
  displayName?: string;
  pictureUrl?: string;
  size?: number;
  className?: string;
}

export const UserInfo: FunctionComponent<UserInfoProps> = ({ id, name, displayName, pictureUrl, size = 22, className }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`flex gap-4 items-center ${className}`}>
      {pictureUrl && !isError ? (
        <div className="text-center rounded-full bg-transparent overflow-hidden relative" style={{ width: size, height: size }}>
          {isLoading ? <div className="w-full h-full absolute rounded-full z-10 bg-skeleton animate-pulse" /> : null}
          <img src={pictureUrl} alt="avatar" style={{ width: '100%', height: '100%' }} onError={() => setIsError(true)} onLoad={() => setIsLoading(false)} />
        </div>
      ) : (
        <div className="text-center rounded-full bg-orange-600 bg-opacity-70 text-white relative" style={{ width: size, height: size }}>
          <i className={`icon icon-avatar-${Number(id) % 10}`} style={{ lineHeight: `${size}px`, fontSize: `${size * 0.55}px` }}/>
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