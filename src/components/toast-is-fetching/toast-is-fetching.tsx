import { FunctionComponent } from 'preact';
import { createPortal } from 'preact/compat';
import { useRef, useState, useEffect } from 'preact/hooks';
import { ImgSpinner } from '@app-components/img-spinner/img-spinner';
import './toast-is-fetching.css';

export interface ToastIsFetchingProps {
  isShow?: boolean;
}

export const ToastIsFetching: FunctionComponent<ToastIsFetchingProps> = ({ isShow }) => {
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
    }, 30);
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
    <div className="toast-is-fetching" ref={ref}>
      <div className="spinner-wrap">
        <ImgSpinner className="spinner" size={60} />
      </div>
    </div>,
    document.body,
  ) : null;
}

