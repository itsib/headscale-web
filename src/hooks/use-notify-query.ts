import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { NotifyInstance } from '@app-types';
import { useNotify } from '@app-hooks/use-notify.ts';

export function useNotifyQuery() {
  const notify = useNotify();
  const { t } = useTranslation();
  const [instance, setInstance] = useState<NotifyInstance | undefined>();

  const start = useCallback(() => {
    setInstance(notify({ status: 'loading', title: t('saving'), timeout: Infinity }));
  }, [t, notify]);

  const success = useCallback(() => {
    if (!instance) return;

    setTimeout(() => {
      instance.update({ status: 'success', title: t('saved'), timeout: 2_000 });
    }, 800);
    setInstance(undefined);
  }, [t, instance]);

  const error = useCallback(
    (message: string) => {
      if (!instance) return;

      instance.update({ status: 'error', title: t(message) });
      setInstance(undefined);
    },
    [t, instance]
  );

  return { start, success, error };
}
