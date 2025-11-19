import type { FC } from 'react';

export const DeviceLoading: FC = () => {
  return (
    <div className="device-loading">
      <div className="skeleton-col">
        <div className="skeleton-block h-sm w-40" />
        <div className="skeleton-block h-sm w-30" />
        <div className="skeleton-block h-sm w-60" />
        <div className="skeleton-block h-sm w-30" />
        <div className="skeleton-block h-sm w-10" />
        <div className="skeleton-block h-sm w-70" />
        <div className="skeleton-block h-sm w-50" />
        <div className="skeleton-block h-sm w-30" />
        <div className="skeleton-block h-sm w-70" />
        <div className="skeleton-block h-sm w-10" />
      </div>
    </div>
  );
};
