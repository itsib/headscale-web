import { FC, PropsWithChildren, useEffect, useRef, useState, RefObject } from 'react';
import { PopupPlacement } from './popup-base/_common';
import { PopupBaseAnchor } from './popup-base/popup-base-anchor';
import './popover.css';

export interface PopupProps {
  /**
   * The position of the window relative to the anchor
   */
  placement?: PopupPlacement;

  btnOpenRef?: RefObject<HTMLButtonElement>;
}

export const Popover: FC<PropsWithChildren<PopupProps>> = ({ placement = PopupPlacement.TOP, btnOpenRef, children }) => {
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);

  const [openBtnElement, setOpenBtnElement] = useState<HTMLElement>();
  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect>();

  // Popover menu display stuff
  useEffect(() => {
    const btn = btnOpenRef?.current;
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
  }, [btnOpenRef]);

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
    <PopupBaseAnchor rect={rect} open={isOpen} placement={placement} margin={5}>
      <div className="popup" ref={contentWrapperRef}>
        {children}
      </div>
    </PopupBaseAnchor>
  );
};
