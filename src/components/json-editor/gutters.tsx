import type { FC } from 'react';
import { useMemo } from 'react';

export const Gutters: FC<{ length: number }> = ({ length }) => {
  const elements = useMemo(() => {
    return new Array(Math.max(14, length)).fill(false);
  }, []);

  return (
    <div className="cm-gutters">
      {elements.map((_, i) => (
        <div key={i} className="gutter-element" style={{ height: '22px' }}>
          {i + 1}
        </div>
      ))}
    </div>
  );
};
