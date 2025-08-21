import { useEffect, useRef, useState } from 'preact/hooks';
import { FunctionComponent } from 'preact';
import { createPortal } from 'preact/compat';
import { cn } from 'react-just-ui/utils/cn';
import './base-popup.css';

export enum PopupPlacement {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
}

export interface BasePopupProps {
  /**
   * Determines how the window appears.
   * 'boolean' - show/hide
   * 'click' - display by click to anchor.
   */
  open?: boolean;
  /**
   * ID of the element by which the popup window is positioned
   */
  rect?: DOMRect;
  /**
   * the distance between the anchor and the pop-up block
   */
  margin?: number;
  /**
   * The position of the window relative to the anchor
   */
  placement?: PopupPlacement;
  /**
   * Class name for portal's element
   */
  className?: string;
}

export const BasePopup: FunctionComponent<BasePopupProps> = (props) => {
  const { open, rect: _rect, placement = PopupPlacement.TOP, margin = 10, className } = props;
  const [animated, setAnimated] = useState(false);
  const [rect, setRect] = useState<DOMRect | undefined>(_rect);

  useEffect(() => {
    if (_rect) {
      setRect(_rect);
    }
  }, [_rect]);

  // Animation of disappearance
  useEffect(() => {
    if (open) {
      return setAnimated(true);
    }
    const timer = setTimeout(() => setAnimated(false), 300);
    return () => {
      clearTimeout(timer);
    };
  }, [open]);

  return (
    <>
      {rect && (open || animated)
        ? createPortal(
            <PopupContent
              show={!!open}
              rect={rect}
              children={props.children}
              placement={placement}
              margin={margin}
              className={className}
            />,
            document.body
          )
        : null}
    </>
  );
};

interface PopupContentProps {
  show: boolean;
  rect: DOMRect;
  margin: number;
  placement: PopupPlacement;
  className?: string;
}

const PopupContent: FunctionComponent<PopupContentProps> = (props) => {
  const { show, rect, placement = PopupPlacement.TOP, margin, className, children } = props;
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Compute popup position
  useEffect(() => {
    const popup = popupRef.current;
    if (!popup) {
      return;
    }

    if (!show) {
      popup.classList.remove('show');
      return;
    }

    const height = popup.offsetHeight;
    const width = popup.offsetWidth;

    let top: number;
    let left: number;
    // Above (top)
    if (placement === PopupPlacement.TOP) {
      top = Math.round(rect.y - height - margin);
      left = Math.round(rect.x - width / 2 + rect.width / 2);

      if (window.innerWidth <= left + width) {
        left = Math.round(window.innerWidth - width - margin);
      } else if (left <= 0) {
        left = Math.round(margin);
      }

      if (top <= 0) {
        top = Math.round(rect.y + rect.height + margin);
        popup.classList.add('popup-placement-bottom');
      } else {
        popup.classList.add('popup-placement-top');
      }
    }
    // Below (Bottom)
    else if (placement === PopupPlacement.BOTTOM) {
      top = Math.round(rect.y + rect.height + margin);
      left = Math.round(rect.x - width / 2 + rect.width / 2);

      if (window.innerWidth <= left + width) {
        left = Math.round(window.innerWidth - width - margin);
      } else if (left <= 0) {
        left = Math.round(margin);
      }

      if (window.innerHeight < top + height) {
        top = Math.round(rect.y - height - margin);
        popup.classList.add('popup-placement-top');
      } else {
        popup.classList.add('popup-placement-bottom');
      }
    }
    // Leftward
    else if (placement === PopupPlacement.LEFT) {
      top = Math.round(rect.y - height / 2 + rect.height / 2);
      left = Math.round(rect.x - width - margin);

      if (left <= 0) {
        left = Math.round(rect.x + rect.width + margin);
        popup.classList.add('popup-placement-right');
      } else {
        popup.classList.add('popup-placement-left');
      }
    }
    // Rightward
    else {
      top = Math.round(rect.y - height / 2 + rect.height / 2);
      left = Math.round(rect.x + rect.width + margin);

      if (window.innerWidth <= left + width) {
        left = Math.round(rect.x - width - margin);
        popup.classList.add('popup-placement-left');
      } else {
        popup.classList.add('popup-placement-right');
      }
    }

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;

    setTimeout(() => popup.classList.add('show'), 100);
  }, [rect, placement, show, margin]);

  return (
    <div ref={popupRef} className={cn('base-popup', className)}>
      {children}
    </div>
  );
};
