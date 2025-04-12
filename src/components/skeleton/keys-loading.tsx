import type { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';
import './keys-loading.css';

export const KeysLoading: FunctionComponent<{ rows?: number }> = ({ rows = 3 }) => {
  const items = useMemo(() => new Array(rows).fill(0), [rows]);
  return (
    <div className="keys-loading">
      {items.map((_, i) => (
        <div className="skeleton-row" key={i}>
          <div className="skeleton-circle" />
          <div className="skeleton-row">
            <div className="w-30 skeleton-block"/>
            <div className="w-50 skeleton-block"/>
            <div className="w-20 skeleton-block"/>
          </div>
        </div>
      ))}
    </div>
  );
};