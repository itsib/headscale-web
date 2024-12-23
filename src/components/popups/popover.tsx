import { FC, PropsWithChildren, useEffect, useRef, useState, ReactNode } from 'react';
import { PopupPlacement } from './popup-base/_common';
import { PopupBaseAnchor } from './popup-base/popup-base-anchor';
import './popover.css';

export interface PopupProps {
  /**
   * The position of the window relative to the anchor
   */
  placement?: PopupPlacement;

  content: ReactNode | (() => ReactNode);
}

export const Popover: FC<PropsWithChildren<PopupProps>> = ({ placement = PopupPlacement.TOP, content, children }) => {
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);
  const childWrapperRef = useRef<HTMLDivElement | null>(null);
  const [openBtnElement, setOpenBtnElement] = useState<HTMLElement>();
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect>();

  // Popover menu display stuff
  useEffect(() => {
    const wrapper = childWrapperRef?.current;
    const btn = wrapper?.firstChild as HTMLElement;
    if (!btn) {
      return setOpenBtnElement(undefined);
    }
    setOpenBtnElement(btn);

    const click = (e: MouseEvent) => {
      e.stopPropagation();
      setRect(btn.getBoundingClientRect());
      setIsOpen(i => !i);
    };

    btn.addEventListener('click', click);
    return () => {
      btn.removeEventListener('click', click);
    };
  }, []);

  // Context menu hide stuff
  useEffect(() => {
    if (!openBtnElement || !isOpen) {
      return;
    }

    const handleMousedown = (e: MouseEvent) => {
      if (openBtnElement.contains(e.target as Node) || (contentWrapperRef.current?.contains(e.target as Node) ?? false)) {
        return;
      }
      setIsOpen(false);
    };

    const handleScroll = () => setIsOpen(false);

    document.addEventListener('mousedown', handleMousedown);
    document.addEventListener('wheel', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleMousedown);
      document.removeEventListener('wheel', handleScroll);
    };
  }, [openBtnElement, isOpen]);

  return (
    <>
      <div ref={childWrapperRef}>{children}</div>
      <PopupBaseAnchor rect={rect} open={isOpen} placement={placement} margin={5}>
        <div className="popup" ref={contentWrapperRef}>
          {typeof content === 'function' ? content() : content}
        </div>
      </PopupBaseAnchor>
    </>
  );
};
