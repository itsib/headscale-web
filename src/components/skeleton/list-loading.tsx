import type { FC } from 'react';
import { useMemo } from 'react';
import './list-loading.css';

export const ListLoading: FC<{ rows?: number }> = ({ rows = 4 }) => {
  const items = useMemo(() => new Array(rows).fill(0), [rows]);

  return (
    <div className="list-loading">
      {items.map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-circle size-lg" />
          <div className="skeleton-col">
            <div className="skeleton-block h-sm w-90" />
            <div className="skeleton-block h-sm w-60" />
          </div>
        </div>
      ))}
    </div>
  );
};
