import { FunctionComponent } from 'preact';
import { useBreakPoint } from '@app-hooks/use-break-point.ts';
import { ToastFetchingLine, ToastFetchingSpinner } from '@app-components/toast-fetching/toast-fetching';

export const ToastFetching: FunctionComponent<{ isShow: boolean }> = ({ isShow }) => {
  const isMobile = useBreakPoint(768);

  return isMobile ? <ToastFetchingLine isShow={isShow} /> :  <ToastFetchingSpinner isShow={isShow} />
}