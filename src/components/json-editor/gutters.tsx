import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

export const Gutters: FunctionComponent<{ length: number }> = ({ length }) => {
  const elements = useMemo(() => {
    return new Array(Math.max(14, length)).fill(false);
  }, []);

  return (
    <div className="cm-gutters">
      {elements.map((_, i) => (
        <div key={i} class="gutter-element" style="height: 22px;">
          {i + 1}
        </div>
      ))}
    </div>
  );
};
