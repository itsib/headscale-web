import { FunctionComponent } from 'preact';
import { cn } from 'react-just-ui/utils/cn';
import { BasePopup, PopupPlacement } from '@app-components/popups/base-popup/base-popup.tsx';
import { useEffect, useRef, useState } from 'preact/hooks';
import './btn-context-menu.css';

export { PopupPlacement };

export interface BtnContextMenuProps {
  /**
   * The position of the window relative to the anchor
   */
  placement?: PopupPlacement;

  icon?: string;

  btnClassName?: string;
}

export const BtnContextMenu: FunctionComponent<BtnContextMenuProps> = ({ btnClassName, icon, placement, children }) => {
  const menuRef = useRef<HTMLMenuElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect>();

  // Context menu display stuff
  useEffect(() => {
    const btn = buttonRef.current as HTMLButtonElement;
    if (!btn) return;

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
    if (!isOpen) return;

    const handleMousedown = (e: MouseEvent) => {
      const btn = buttonRef.current as HTMLButtonElement;
      const menu = menuRef.current as HTMLMenuElement;
      if (!btn || !menu) return;

      if (btn.contains(e.target as Node) || (menu.contains(e.target as Node))) {
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
  }, [isOpen]);

  return (
    <>
      <button
        role="menu"
        aria-label="Open context menu"
        type="button"
        className={cn('btn btn-open-context-menu', btnClassName)}
        ref={buttonRef}
      >
        <i className={cn('icon', icon || 'icon-context-menu')} />
      </button>
      <BasePopup rect={rect} open={isOpen} placement={placement}>
        <menu role="menu" className="popup context-menu" ref={menuRef} onClick={e => e.stopPropagation()}>
          {children}
        </menu>
      </BasePopup>
    </>
  );
};