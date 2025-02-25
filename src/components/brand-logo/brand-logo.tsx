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
      x="0"
      y="0"
      viewBox="0 0 60 60"
    >
      <g>
        <path fill="currentColor"
              d="M13.94 43.76V54c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1V43.76c0-.55.45-1 1-1h6.94c.55 0 1 .45 1 1z"
              opacity="1"/>
        <path fill="rgb(var(--accent))"
              d="M27.63 33.53V54c0 .55-.45 1-1 1h-6.94c-.55 0-1-.45-1-1V33.53c0-.55.45-1 1-1h6.94c.55 0 1 .45 1 1zM5.15 13.35l4.88-7.88c.23-.38.69-.56 1.12-.43.43.12.73.51.73.96v19.31c0 .56-.45 1-1 1-.56 0-1-.44-1-1V9.52l-3.03 4.89c-.29.47-.9.61-1.37.32s-.62-.91-.33-1.38z"
              opacity="1"/>
        <path fill="currentColor"
              d="m22.54 17.96-4.88 7.88c-.18.3-.51.47-.85.47-.09 0-.18-.01-.27-.03-.43-.13-.73-.52-.73-.97V6c0-.55.45-1 1-1s1 .45 1 1v15.79l3.02-4.88c.29-.47.91-.62 1.38-.33s.62.91.33 1.38zM41.32 25.31V54c0 .55-.45 1-1 1h-6.94c-.55 0-1-.45-1-1V25.31c0-.55.45-1 1-1h6.94c.55 0 1 .45 1 1z"
              opacity="1"/>
        <path fill="rgb(var(--accent))"
              d="M55 12.05V54c0 .55-.44 1-1 1h-6.93c-.55 0-1-.45-1-1V12.05c0-.55.45-1 1-1H54c.56 0 1 .45 1 1z"
              opacity="1"/>
      </g>
    </svg>
  );
}