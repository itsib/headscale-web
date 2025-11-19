import { useEffect, useRef, useState } from 'react';
import type { PropsWithChildren, FC, JSX } from 'react';
import { PopupPlacement } from '@app-components/popups/base-popup/base-popup';
import { BasePopup } from '@app-components/popups/base-popup/base-popup.tsx';
import './popover.css';

export interface PopupProps {
  /**
   * The position of the window relative to the anchor
   */
  placement?: PopupPlacement;

  Content: () => JSX.Element;
}

export const Popover: FC<PropsWithChildren<PopupProps>> = (props) => {
  const { placement = PopupPlacement.TOP, Content, children } = props;
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
      e.preventDefault();
      setRect(btn.getBoundingClientRect());
      setIsOpen((i) => !i);
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
      if (
        openBtnElement.contains(e.target as Node) ||
        (contentWrapperRef.current?.contains(e.target as Node) ?? false)
      ) {
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
      <BasePopup rect={rect} open={isOpen} placement={placement} margin={5}>
        <div className="popup popover" ref={contentWrapperRef}>
          <Content />
        </div>
      </BasePopup>
    </>
  );
};
