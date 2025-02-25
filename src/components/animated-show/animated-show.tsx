import { useEffect, useRef, useState } from 'preact/hooks';
import { FunctionComponent, cloneElement } from 'preact';

export interface AnimatedShowProps {
  show?: boolean;
  showClassName?: string;
}

export const AnimatedShow: FunctionComponent<AnimatedShowProps> = ({ children, show, showClassName = 'show' }) => {
  const [animated, setAnimated] = useState(false);
  const childrenRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const children = childrenRef.current as HTMLElement;
    if (!children) return;

    if (show) {
      setAnimated(true);
      setTimeout(() => children.classList.add(showClassName), 20);
    } else {
      children.classList.remove(showClassName);
      children.addEventListener('animationend', () => {
        setAnimated(false);
      }, { once: true });
    }
  }, [show, showClassName]);

  return (
    <>
      {animated || show ? cloneElement(<>{children}</>, { ref: (ref: any) => (childrenRef.current = ref) } as any) : null}
    </>
  );
}