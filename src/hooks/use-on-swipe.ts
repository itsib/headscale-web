import { useEffect, useRef } from 'react';

export function useOnSwipe(callback: (side: 'L' | 'R') => void, threshold = 100) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (window === undefined) return;

    let touched = false;
    let touchstartX = 0;
    let touchendX = 0;

    function computeDirection() {
      if (touchendX < touchstartX) {
        callbackRef.current('L');
      } else if (touchendX > touchstartX) {
        callbackRef.current('R');
      }
    }

    function isSwapped(posX: number) {
      const diff = touchstartX > posX ? touchstartX - posX : posX - touchstartX;

      return diff > threshold;
    }

    function touchstart(event: TouchEvent) {
      touched = true;
      touchstartX = event.changedTouches[0].screenX;
    }

    function touchmove(event: TouchEvent) {
      if (touched && isSwapped(event.changedTouches[0].screenX)) {
        touchendX = event.changedTouches[0].screenX;
        touched = false;
        computeDirection();
      }
    }

    function touchcancel() {
      touched = false;
    }

    function touchend(event: TouchEvent) {
      if (touched) {
        touched = false;

        if (isSwapped(event.changedTouches[0].screenX)) {
          touchendX = event.changedTouches[0].screenX;
          computeDirection();
        }
      }
    }

    window.addEventListener('touchstart', touchstart);
    window.addEventListener('touchmove', touchmove);
    window.addEventListener('touchcancel', touchcancel);
    window.addEventListener('touchend', touchend);

    return () => {
      window.removeEventListener('touchstart', touchstart);
      window.removeEventListener('touchmove', touchmove);
      window.removeEventListener('touchcancel', touchcancel);
      window.removeEventListener('touchend', touchend);
    };
  }, [threshold]);
}
