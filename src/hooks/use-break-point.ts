import { useState, useEffect } from 'react';

/**
 * Returns true if window width less than the width parameter
 * @param width
 */
export function useBreakPoint(width: number): boolean {
  const [isLower, setIsLower] = useState(window.innerWidth < width);

  useEffect(() => {
    const resize = () => setIsLower(window.innerWidth < width);

    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [width]);

  return isLower;
}
