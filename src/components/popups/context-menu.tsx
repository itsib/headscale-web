import { FC, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import { PopupPlacement } from './popup-base/_common';
import { PopupBaseAnchor } from './popup-base/popup-base-anchor';
import './context-menu.css';

export interface ContextMenuProps {
  /**
   * The position of the window relative to the anchor
   */
  placement?: PopupPlacement;

  menu: ReactNode | (() => ReactNode);
}

export const ContextMenu: FC<PropsWithChildren<ContextMenuProps>> = ({ placement, children, menu }) => {
  const childWrapperRef = useRef<HTMLDivElement | null>(null);
  const contextMenuRef = useRef<HTMLMenuElement | null>(null);
  const [openBtnElement, setOpenBtnElement] = useState<HTMLElement>();

  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect>();

  // Context menu display stuff
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
      if (openBtnElement.contains(e.target as Node) || (contextMenuRef.current?.contains(e.target as Node) ?? false)) {
        return;
      }
      setIsOpen(false);
    };

    const handleMouseup = () => {
      setTimeout(() =>  setIsOpen(false), 10);
    };

    const handleScroll = () => setIsOpen(false);

    document.addEventListener('mousedown', handleMousedown);
    document.addEventListener('mouseup', handleMouseup);
    document.addEventListener('wheel', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleMousedown);
      document.removeEventListener('mouseup', handleMouseup);
      document.removeEventListener('wheel', handleScroll);
    };
  }, [openBtnElement, isOpen]);

  return (
    <>
      <div ref={childWrapperRef}>{children}</div>
      <PopupBaseAnchor rect={rect} open={isOpen} placement={placement}>
        <menu className="popup context-menu" ref={contextMenuRef} onClick={e => e.stopPropagation()}>
          {typeof menu === 'function' ? menu() : menu}
        </menu>
      </PopupBaseAnchor>
    </>
  );
};