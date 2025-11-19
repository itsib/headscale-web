import type { FC } from 'react';
import './editor-loading.css';

export const EditorLoading: FC = () => {
  return (
    <div className="editor-loading">
      <div className="skeleton-row">
        <div className="skeleton-block w-10 h-lg" />
        <div className="skeleton-block w-10 h-lg" />
      </div>
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
