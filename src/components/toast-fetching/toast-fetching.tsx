import { FunctionComponent } from 'preact';
import { createPortal } from 'preact/compat';
import { useEffect, useRef, useState } from 'preact/hooks';
import { ImgSpinner } from '@app-components/img-spinner/img-spinner';
import './toast-fetching.css';

export interface ToastFetchingProps {
  isShow?: boolean;
}

export const ToastFetchingSpinner: FunctionComponent<ToastFetchingProps> = ({ isShow }) => {
  const [showToast, setShowToast] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Show toast
  useEffect(() => {
    if (!isShow) return;

    setShowToast(true);

    setTimeout(() => {
      const block = ref.current;
      if (!block) return;

      block.classList.add('show');
    }, 30);
  }, [isShow]);

  // Hide toast
  useEffect(() => {
    const block = ref.current;
    const toast = block?.firstElementChild;
    if (isShow || !toast || !block) return;

    setShowToast(true);

    function transitionend() {
      setShowToast(false);
    }

    toast.addEventListener('transitionend', transitionend, { once: true });
    block.classList.remove('show');

    return () => {
      toast.removeEventListener('transitionend', transitionend);
    };
  }, [isShow]);

  return showToast ? createPortal(
    <div className="toast-fetching-spinner" ref={ref}>
      <div className="vertical-transition">
        <ImgSpinner className="spinner" size={60} />
      </div>
    </div>,
    document.body,
  ) : null;
}

export const ToastFetchingLine: FunctionComponent<ToastFetchingProps> = ({ isShow }) => {
  const [showToast, setShowToast] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isShow) return;

    setShowToast(true);

    setTimeout(() => {
      const loader = ref.current;
      if (!loader) return;

      loader.classList.add('show-in');
    }, 30);
  }, [isShow]);

  useEffect(() => {
    const loader = ref.current;
    if (!loader || isShow) return;

    function remove() {
      setShowToast(false);
    }

    loader.classList.remove('show-in');

    loader.addEventListener('transitionend', remove, { once: true });
    loader.classList.add('show-out');
  }, [isShow]);

  return showToast ? createPortal(
    <div className="toast-fetching-line" ref={ref} />,
    document.body,
  ) : null;
};