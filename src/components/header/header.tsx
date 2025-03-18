import { BrandLogo } from '@app-components/brand-logo/brand-logo';
import { SiteNavMenu } from '@app-components/header/_site-nav-menu';
import { useState } from 'preact/hooks';
import { useBreakPoint } from '@app-hooks/use-break-point';
import { BtnHamburger } from '@app-components/btn-hamburger/btn-hamburger';
import { BtnConfig } from '@app-components/btn-config/btn-config';
import { cn } from 'react-just-ui/utils/cn';
import { useOnSwipe } from '@app-hooks/use-on-swipe';
import './header.css';

export const Header = () => {
  const isMobile = useBreakPoint(768);

  return isMobile ? <MobileHeader /> : <DesktopHeader />;
}

function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  useOnSwipe(dir => (dir === 'L' ? setIsOpen(false) : null));

  return (
    <header className="header">
      <div className="container">
        <BtnHamburger size="sm" isOpen={isOpen} setIsOpen={setIsOpen} />

        <BtnConfig />
      </div>

      {isOpen ? <div className="mobile-nav-menu-backdrop" onClick={() => setIsOpen(false)} /> : null}

      <div className={cn('mobile-nav-menu-wrap', { 'is-open': isOpen })}>
        <SiteNavMenu layout="mobile" onClick={() => setIsOpen(false)} />
      </div>
    </header>
  );
}

function DesktopHeader() {
  return (
    <header className="header">
      <div className="container">
        <a href="/" className="flex items-center text-neutral-500 dark:text-gray-300">
          <BrandLogo />
        </a>

        <div className="ml-6 mr-auto">
          <SiteNavMenu layout="desktop" />
        </div>

        <BtnConfig />
      </div>
    </header>
  );
}