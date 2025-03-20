import { FunctionComponent } from 'preact';
import { createPortal } from 'preact/compat';
import { useState, useRef, useEffect } from 'preact/hooks';
import { ImgCompass } from '@app-components/img-compass/img-compass.tsx';
import { Trans } from 'react-i18next';
import './toast-offline.css';

export interface ToastOfflineProps {
  isShow?: boolean;
}

export const ToastOffline: FunctionComponent<ToastOfflineProps> = ({ isShow }) => {
  const [_showToast, setShowToast] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Show toast
  useEffect(() => {
    if (!isShow) return;

    setShowToast(true);

    setTimeout(() => {
      const toast = ref.current;
      if (!toast) return;

      toast.classList.add('show');
    }, 10);
  }, [isShow]);

  // Hide toast
  useEffect(() => {
    const toast = ref.current;
    if (isShow || !toast) return;

    setShowToast(true);

    function transitionend() {
      setShowToast(false);
    }

    toast.addEventListener('transitionend', transitionend, { once: true });
    toast.classList.remove('show');

    return () => {
      toast.removeEventListener('transitionend', transitionend);
    };
  }, [isShow]);

  return _showToast ? createPortal(
    <div className="toast-offline" ref={ref}>
      <ImgCompass className="wait" size={36} />
      <div>
        <Trans i18nKey="error_offline" />
        <span>...</span>
      </div>
    </div>,
    document.body,
  ) : null;
}