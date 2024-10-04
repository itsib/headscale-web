/* eslint-disable @typescript-eslint/brace-style */
import React, { FC, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PopupPlacement } from './_common';
import './popup-base-wrap.css';

const ARROW_SIZE = 12;
const MARGIN = 10;

export interface PopupBaseWrapProps {
  content?: string | ReactNode;
  placement?: PopupPlacement;
  className?: string;
  hideArrow?: boolean;
}

export const PopupBaseWrap: FC<PropsWithChildren<PopupBaseWrapProps>> = ({ content, placement, children, ...props }) => {
  const childrenWrapperRef = useRef<HTMLDivElement | null>(null);
  const [rect, setRect] = useState<DOMRect | undefined>();
  const [animated, setAnimated] = useState(false);

  // Subscribe to mouse events
  useEffect(() => {
    const childrenWrapper = childrenWrapperRef.current;
    if (!childrenWrapper) {
      return;
    }

    const element = (childrenWrapper.childNodes.length === 1 ? childrenWrapper.firstChild : childrenWrapper) as HTMLElement;

    const mouseenter = (event: Event) => {
      setRect((event.target as HTMLSpanElement).getBoundingClientRect());
      setAnimated(true);
    };
    const mouseleave = () => setRect(undefined);
    const wheel = () => setRect(undefined);

    element.addEventListener('mouseenter', mouseenter);
    element.addEventListener('mouseleave', mouseleave);
    element.addEventListener('wheel', wheel, { passive: true });

    return () => {
      element.removeEventListener('mouseenter', mouseenter);
      element.removeEventListener('mouseleave', mouseleave);
      element.removeEventListener('wheel', wheel);
    };
  }, []);

  // Animation of disappearance
  useEffect(() => {
    if (rect) {
      return;
    }
    const timer = setTimeout(() => setAnimated(false), 300);
    return () => {
      clearTimeout(timer);
    };
  }, [rect]);

  return (
    <>
      <span ref={childrenWrapperRef}>{children}</span>
      {rect || animated ? createPortal(<PopupContent rect={rect} content={content} placement={placement} {...props} />, document.body) : null}
    </>
  );
};

const PopupContent: FC<{ rect?: DOMRect } & PopupBaseWrapProps> = ({ rect, content, placement = PopupPlacement.TOP, className, hideArrow }) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  // Compute popup position
  useEffect(() => {
    const popup = popupRef.current;
    if (!popup) {
      return;
    }

    if (!rect) {
      popup.classList.remove('show');
      return;
    }

    const height = popup.offsetHeight;
    const width = popup.offsetWidth;

    let top: number;
    let left: number;
    // Above (top)
    if (placement === PopupPlacement.TOP) {
      top = Math.round(rect.y - height - ARROW_SIZE);
      left = Math.round(rect.x - width / 2 + rect.width / 2);

      if (top <= 0) {
        top = Math.round(rect.y + rect.height + ARROW_SIZE);
        popup.classList.add('popup-placement-bottom');
      } else {
        popup.classList.add('popup-placement-top');
      }

      if (left + width > window.innerWidth) {
        left = rect.x - width + ARROW_SIZE + MARGIN;
        popup.classList.add('arrow-right');
      } else if (left <= 0) {
        left = rect.x + rect.width - ARROW_SIZE - MARGIN;
        popup.classList.add('arrow-left');
      }
    }
    // Below (Bottom)
    else if (placement === PopupPlacement.BOTTOM) {
      top = Math.round(rect.y + rect.height + ARROW_SIZE);
      left = Math.round(rect.x - width / 2 + rect.width / 2);

      if (window.innerHeight < top + height) {
        top = Math.round(rect.y - height - ARROW_SIZE);
        popup.classList.add('popup-placement-top');
      } else {
        popup.classList.add('popup-placement-bottom');
      }

      if (left + width > window.innerWidth) {
        left = rect.x - width + ARROW_SIZE + MARGIN;
        popup.classList.add('arrow-right');
      } else if (left <= 0) {
        left = rect.x + rect.width - ARROW_SIZE - MARGIN;
        popup.classList.add('arrow-left');
      }
    }
    // Leftward
    else if (placement === PopupPlacement.LEFT) {
      top = Math.round(rect.y - height / 2 + rect.height / 2);
      left = Math.round(rect.x - width - ARROW_SIZE);

      if (left <= 0) {
        left = Math.round(rect.x + rect.width + ARROW_SIZE);
        popup.classList.add('popup-placement-right');
      } else {
        popup.classList.add('popup-placement-left');
      }

      if (top <= 4) {
        top = Math.round(rect.y - MARGIN);
        popup.classList.add('arrow-top');
      } else if (top + height > window.innerHeight) {
        top = rect.y + rect.height - height + MARGIN;
        popup.classList.add('arrow-bottom');
      }
    }
    // Rightward
    else {
      top = Math.round(rect.y - height / 2 + rect.height / 2);
      left = Math.round(rect.x + rect.width + ARROW_SIZE);

      if (window.innerWidth <= left + width) {
        left = Math.round(rect.x - width - ARROW_SIZE);
        popup.classList.add('popup-placement-left');
      } else {
        popup.classList.add('popup-placement-right');
      }

      if (top <= 4) {
        top = Math.round(rect.y - MARGIN);
        popup.classList.add('arrow-top');
      } else if (top + height > window.innerHeight) {
        top = rect.y + rect.height - height + MARGIN;
        popup.classList.add('arrow-bottom');
      }
    }

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;

    setTimeout(() => popup.classList.add('show'), 100);
  }, [rect, placement]);

  return (
    <div ref={popupRef} className={`popup-base popup-base-wrap-content ${className || ''}`}>
      {hideArrow ? null : <div className="arrow" />}
      {content}
    </div>
  );
};
