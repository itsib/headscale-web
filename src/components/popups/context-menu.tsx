import { FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { BasePopup, PopupPlacement } from '@app-components/popups/base-popup/base-popup';
import './context-menu.css';
import { cn } from 'react-just-ui/utils/cn';

export interface ContextMenuProps {
  /**
   * The position of the window relative to the anchor
   */
  placement?: PopupPlacement;

  icon?: string;
}

export const ContextMenu: FunctionComponent<ContextMenuProps> = ({ placement, icon, children }) => {
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
        className="inline-block text-neutral-300 dark:text-neutral-600 opacity-90 relative top-[2px] transition hover:opacity-60 hover:text-accent active:opacity-90"
        ref={buttonRef}
      >
        <i className={cn('icon text-[24px]', icon || 'icon-context-menu')} />
      </button>
      <BasePopup rect={rect} open={isOpen} placement={placement}>
        <menu role="menu" className="popup context-menu" ref={menuRef} onClick={e => e.stopPropagation()}>
          {children}
        </menu>
      </BasePopup>
    </>
  );
};