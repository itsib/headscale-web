import { useMemo, useRef } from 'preact/hooks';

export function useId(): string {
  const ref = useRef<string>();

  return useMemo(() => {
    if (!ref.current) {
      ref.current = Math.random().toString(10).slice(2);
    }

    return ref.current;
  }, []);
}