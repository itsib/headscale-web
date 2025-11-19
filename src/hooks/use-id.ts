import { useMemo, useRef } from 'react';

export function useId(): string {
  const ref = useRef<string>(null);

  return useMemo(() => {
    if (!ref.current) {
      ref.current = Math.random().toString(10).slice(2);
    }

    return ref.current;
  }, []);
}
