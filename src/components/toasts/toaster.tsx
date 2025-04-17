import { FunctionComponent } from 'preact';
import { useState, useCallback, useMemo } from 'preact/hooks';
import { NotifyInstance } from '@app-types';
import { Notification } from '@app-components/toasts/notification.tsx';
import './toaster.css';

export interface ToasterProps {
  notifies: NotifyInstance[];
  margin: number;
}

export const Toaster: FunctionComponent<ToasterProps> = ({ notifies, margin = 20 }) => {
  const [heights, setHeights] = useState<{ [id: string]: number }>({});

  const setHeight = useCallback((id: string, height: number | null) => {
    if (height === null) {
      setHeights(heights => {
        Reflect.deleteProperty(heights, id);
        return { ...heights };
      });
    } else {
      setHeights(heights => ({ ...heights, [id]: height }));
    }
  }, []);

  const offsets = useMemo(() => {
    let sum = 0;
    const offsets: { [id: string]: number } = {};

    for (let i = notifies.length - 1; i >= 0; i--) {
      const { id, closed } = notifies[i];
      const height = heights[id];

      if (!closed && !isNaN(height)) {
        sum = sum + height + (sum === 0 ? margin : (margin / 2));
      }
      offsets[id] = sum;
    }

    return offsets;
  }, [heights, notifies, margin]);

  return (
    <div class="toaster" style={{ '--notify-margin': `${margin}px` }}>
      {notifies.map((notify, index) => {
        return <Notification key={notify.id} offset={-offsets[notify.id]} index={index} setHeight={setHeight} {...notify} />;
      })}
    </div>
  );
};