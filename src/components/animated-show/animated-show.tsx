import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';

export interface AnimatedShowProps {
  show?: boolean;
  showClassName?: string;
  children: ReactElement;
}

export const AnimatedShow: FC<AnimatedShowProps> = ({ children, show, showClassName = 'show' }) => {
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
      {animated || show ? React.cloneElement(children, { ref: (ref: any) => (childrenRef.current = ref) } as any) : null}
    </>
  );
}