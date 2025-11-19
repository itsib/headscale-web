import type { FC, PropsWithChildren } from 'react';
import { useCallback, useState } from 'react';
import { NotifyContext } from '@app-context/notify';
import { useIsFetching } from '@tanstack/react-query';
import { ToastFetching } from '@app-components/toasts/toast-fetching';
import { Notify, NotifyInstance } from '@app-types';
import { getId } from '@app-utils/get-id.ts';
import { Toaster } from '@app-components/toasts/toaster.tsx';

const SHOW_TIMEOUT = 4000;
const MAX_COUNT = 3;

export const NotifyProvider: FC<PropsWithChildren> = ({ children }) => {
  const isFetching = useIsFetching();
  const [notifies, setNotifies] = useState<NotifyInstance[]>([]);

  const notify = useCallback((opts: Notify): NotifyInstance => {
    const id = getId();
    const timeout = opts.timeout || SHOW_TIMEOUT;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const notify: NotifyInstance = {
      id,
      closed: false,
      createdAt: Date.now(),
      update(fields: Partial<Notify>) {
        setNotifies((items) => {
          const index = items.findIndex((item) => item.id === id && !item.closed);
          if (index === -1) {
            return items;
          }
          const old = items[index];

          if (fields.timeout) {
            if (timer) {
              clearTimeout(timer);
            }
            timer = setTimeout(() => notify.close(), fields.timeout);
          }

          items.splice(index, 1, { ...old, ...fields });

          return [...items];
        });
      },
      close() {
        if (timer) {
          clearTimeout(timer);
        }

        setNotifies((items) => {
          const index = items.findIndex((item) => item.id === id && !item.closed);
          if (index === -1) {
            return items;
          }
          const old = items[index];

          items.splice(index, 1, { ...old, closed: true });

          setTimeout(() => notify.remove(), 1500);

          return [...items];
        });
      },
      remove() {
        setNotifies((items) => items.filter((item) => item.id !== id));
      },
      ...opts,
    };

    if (isFinite(timeout)) {
      timer = setTimeout(() => notify.close(), timeout);
    }

    setNotifies((items) => {
      return [...items.reverse().slice(0, MAX_COUNT).reverse(), notify];
    });

    return notify;
  }, []);

  return (
    <NotifyContext.Provider value={{ notify }}>
      <ToastFetching isShow={!!isFetching} />
      <Toaster notifies={notifies} margin={20} />
      {children}
    </NotifyContext.Provider>
  );
};
