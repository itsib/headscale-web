import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { PopupPlacement } from './popup-base/_common';
import { PopupBaseAnchor } from './popup-base/popup-base-anchor';
import './popup.css';

export interface PopupProps {
  /**
   * ID of the element by which the popup window is positioned
   */
  anchor: string;
  /**
   * The position of the window relative to the anchor
   */
  placement?: PopupPlacement;
  /**
   * Determines how the window appears.
   * 'boolean' - show/hide
   * 'click' - display by click to anchor.
   */
  isOpen: boolean;
  /**
   * Emit when should close
   */
  onDismiss: () => void;
}

export const Popup: FC<PropsWithChildren<PopupProps>> = ({ anchor, placement = PopupPlacement.TOP, isOpen, onDismiss, children }) => {
  const contentWrapperRef = useRef<HTMLDivElement | null>(null);

  const [anchorElement, setAnchorElement] = useState<HTMLElement>();
  const [rect, setRect] = useState<DOMRect>();

  useEffect(() => {
    const element = document.getElementById(anchor);
    if (!element) {
      setAnchorElement(undefined);
      setRect(undefined);
      return;
    }
    setAnchorElement(element);
    setRect(element.getBoundingClientRect());

    const handleResize = () => setRect(element.getBoundingClientRect());

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [anchor, isOpen]);

  useEffect(() => {
    if (!anchorElement || !isOpen) {
      return;
    }

    const handleMousedown = (e: MouseEvent) => {
      if (anchorElement.contains(e.target as Node) || (contentWrapperRef.current?.contains(e.target as Node) ?? false)) {
        return;
      }
      onDismiss?.();
    };

    document.addEventListener('mousedown', handleMousedown);
    document.addEventListener('wheel', handleMousedown);
    return () => {
      document.removeEventListener('mousedown', handleMousedown);
      document.removeEventListener('wheel', handleMousedown);
    };
  }, [anchorElement, isOpen]);

  return (
    <PopupBaseAnchor rect={rect} open={isOpen} placement={placement}>
      <div className="popup" ref={contentWrapperRef}>
        {children}
      </div>
    </PopupBaseAnchor>
  );
};
