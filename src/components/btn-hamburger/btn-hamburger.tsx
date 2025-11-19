import type { FC } from 'react';
import { cn } from 'react-just-ui/utils/cn';
import './btn-hamburger.css';

export interface BtnHamburgerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SIZES = {
  xs: 20,
  sm: 25,
  md: 30,
  lg: 35,
  xl: 45,
};

export const BtnHamburger: FC<BtnHamburgerProps> = ({ size = 'md', isOpen, setIsOpen }) => {
  return (
    <button
      aria-label="Open site navigation menu"
      role="button"
      className={cn('btn btn-hamburger', { active: isOpen })}
      onClick={() => setIsOpen(!isOpen)}
      style={{ '--hamburger-height': SIZES[size] + 'px' } as any}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </button>
  );
};
