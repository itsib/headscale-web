import { FC } from 'react';

export interface BrandLogoProps {
  size?: number;
}

export const BrandLogo: FC<BrandLogoProps> = ({ size = 30 }) => {
  return (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 512 512"
    >
      <g fill="rgb(var(--accent))">
        <path
          d="m44 120a28 27 0 0 0-28 27v217a28 27 0 0 0 55 0v-217a28 27 0 0 0-27-27"
          style={{ paintOrder: 'stroke fill markers' }}
        />
        <path
          d="m468 120a28 27 0 0 0-28 27v217a28 27 0 0 0 55 0v-217a28 27 0 0 0-28-27"
          style={{ paintOrder: 'stroke fill markers' }}
        />
        <path
          d="m150 158a28 27 0 0 0-28 27v142a28 27 0 0 0 55 0v-142a28 27 0 0 0-28-27"
          style={{ paintOrder: 'stroke fill markers' }}
        />
        <path
          d="m256 86a28 27 0 0 0-27 27v285a28 27 0 0 0 55 0v-285a28 27 0 0 0-28-27"
          style={{ paintOrder: 'stroke fill markers' }}
        />
        <path
          d="m362 17a27 27 0 0 0-28 27v426a28 27 0 0 0 55 0v-426a27 27 0 0 0-28-27"
          style={{ paintOrder: 'stroke fill markers' }}
        />
      </g>
    </svg>
  );
};
