import { useContext } from 'preact/hooks';
import { NotifyContext } from '@app-context/notify';

export function useNotify() {
  const { notify } = useContext(NotifyContext);

  return notify;
}