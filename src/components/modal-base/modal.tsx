import { animated, easings, useSpring } from '@react-spring/web';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './modal.css';

export interface ModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const Modal: FC<PropsWithChildren<ModalProps>> = ({ isOpen, onDismiss, children }) => {
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null);
  const [, setShowUp] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const isAnimatedRef = useRef(isAnimated);
  isAnimatedRef.current = isAnimated;

  const [overlayStyles, overlayApi] = useSpring(
    () => ({
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: {
        easing: easings.easeInBack(100),
      },
    }),
    [],
  );

  const [contentStyles, contentApi] = useSpring(
    () => ({
      from: { y: 24 },
      to: { y: 0 },
      config: {
        easing: easings.easeInBack(200),
      },
    }),
    [],
  );

  useEffect(() => {
    if (!isOpen || !window || !overlay) {
      return;
    }

    const scrollHandler = (event: Event): void => {
      setShowUp(!!(event.target as HTMLDivElement).scrollTop);
    };

    overlay.addEventListener('scroll', scrollHandler);

    return () => {
      overlay.removeEventListener('scroll', scrollHandler);
    };
  }, [overlay, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimated(true);
      overlayApi.set({ opacity: 0 });
      overlayApi.start({ opacity: 1 });
      contentApi.set({ y: 24 });
      contentApi.start({ y: 0 });
    } else if (isAnimatedRef.current) {
      overlayApi.start({ opacity: 0 });
      contentApi.start({ y: 24 })[0].then(() => setIsAnimated(false));
    }
  }, [contentApi, overlayApi, isOpen]);

  return isOpen || isAnimated ? (
    <>
      {createPortal(
        <animated.div style={overlayStyles} aria-label="dialog overlay" className="modal-overlay" onClick={() => onDismiss()} ref={setOverlay}>
          <animated.div style={contentStyles} aria-label="dialog content" className="modal-overlay-content" onClick={event => event.stopPropagation()}>
            {children}
          </animated.div>
        </animated.div>,
        document.body,
      )}
    </>
  ) : null;
};

export default Modal;
