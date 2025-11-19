import type { FC } from 'react';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { NotifyInstance } from '@app-types';
import { cn } from 'react-just-ui/utils/cn';
import { ErrorIcon } from '@app-components/icons/error-icon.tsx';
import { SuccessIcon } from '@app-components/icons/success-icon.tsx';
import { WarningIcon } from '@app-components/icons/warning-icon.tsx';
import { InfoIcon } from '@app-components/icons/info-icon.tsx';
import { LoadingIcon } from '@app-components/icons/loading-icon.tsx';
import './notification.css';

export interface NotificationProps extends NotifyInstance {
  index: number;
  offset: number;
  setHeight: (id: string, height: number | null) => void;
}

export const Notification: FC<NotificationProps> = (props) => {
  const { id, offset, status, title, description, setHeight, closed, close, dismissible } = props;
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<SVGSVGElement | null>(null);
  const [mounted, setMounted] = useState<boolean>(true);
  const [offsetPrev, setOffsetPrev] = useState(offset);

  useEffect(() => {
    if (offset) {
      setOffsetPrev(offset);
    }
  }, [offset]);

  // Pause svg animation for show transition
  useEffect(() => {
    const notify = notificationRef.current;
    const icon = iconRef.current;
    if (!icon || !notify) return;

    icon.pauseAnimations();

    const timeout = setTimeout(transitionend, 400);

    function transitionend() {
      clearTimeout(timeout);
      icon?.unpauseAnimations();
    }

    notify.addEventListener('transitionend', transitionend);
    notify.addEventListener('transitioncancel', transitionend);

    return () => {
      clearTimeout(timeout);
      notify.removeEventListener('transitionend', transitionend);
      notify.removeEventListener('transitioncancel', transitionend);
    };
  }, []);

  // Run show in animations
  useEffect(() => setMounted(true), []);

  // Add notification height in heights
  useEffect(() => {
    const toastNode = notificationRef.current;
    if (!toastNode) return;

    const height = toastNode.getBoundingClientRect().height;
    // Add toast height to heights array after the toast is mounted
    setHeight(id, height);

    return () => {
      setHeight(id, null);
    };
  }, [setHeight, id]);

  // Update notification height in heights
  useLayoutEffect(() => {
    const toastNode = notificationRef.current;
    if (!toastNode || !mounted) return;

    const originalHeight = toastNode.style.height;
    toastNode.style.height = 'auto';
    const height = toastNode.getBoundingClientRect().height;
    toastNode.style.height = originalHeight;

    setHeight(id, height);
  }, [mounted, title, description, setHeight, id]);

  return (
    <div
      className={cn('notification', { mounted, closed })}
      ref={notificationRef}
      style={
        {
          '--notify-offset': `${closed ? offsetPrev : offset}px`,
        } as any
      }
    >
      {status ? (
        <div className="status-icon">
          {status === 'error' ? (
            <ErrorIcon size={20} ref={iconRef} />
          ) : status === 'success' ? (
            <SuccessIcon size={20} ref={iconRef} />
          ) : status === 'warning' ? (
            <WarningIcon size={20} ref={iconRef} />
          ) : status === 'info' ? (
            <InfoIcon size={20} ref={iconRef} />
          ) : status === 'loading' ? (
            <LoadingIcon size={20} ref={iconRef} />
          ) : null}
        </div>
      ) : null}

      <div className="content">
        {title ? <div className="title">{title}</div> : null}
        {description ? <div className="description">{description}</div> : null}
      </div>

      {dismissible ? (
        <button className="close" onClick={close}>
          <i className="icon icon-close" />
        </button>
      ) : null}
    </div>
  );
};
