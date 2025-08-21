import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { cn } from 'react-just-ui/utils/cn';
import { Size } from '@app-types';
import './user-photo.css';

export interface UserPhotoProps {
  size?: Size;
  /**
   * User is
   */
  id?: string;
  /**
   * User profile picture
   */
  pictureUrl?: string;

  className?: string;
}

export const UserPhoto: FunctionComponent<UserPhotoProps> = (props) => {
  const { size = 'md', id, pictureUrl, className } = props;

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let diameter: number;
  let fontSize: number;
  switch (size) {
    case 'sm':
      diameter = 20;
      fontSize = 12;
      break;
    case 'lg':
      diameter = 36;
      fontSize = 20;
      break;
    default:
      diameter = 30;
      fontSize = 16;
      break;
  }

  return (
    <>
      {pictureUrl && !isError ? (
        <div
          className={cn('user-photo', className)}
          style={{ width: `${diameter}px`, height: `${diameter}px` }}
        >
          {isLoading ? <div className="loader skeleton" /> : null}

          <img
            src={pictureUrl}
            alt="avatar"
            width={`${diameter}px`}
            height={`${diameter}px`}
            style={{ width: `${diameter}px`, height: `${diameter}px` }}
            onError={() => setIsError(true)}
            onLoad={() => setIsLoading(false)}
          />
        </div>
      ) : (
        <div
          className={cn('user-photo', 'generated', className)}
          style={{ width: `${diameter}px`, height: `${diameter}px` }}
        >
          <i
            className={`icon icon-avatar-${Number(id) % 10}`}
            style={{ '--icon-size': `${fontSize}px`, 'lineHeight': `${diameter}px` }}
          />
        </div>
      )}
    </>
  );
};
