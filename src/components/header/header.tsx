import { useTranslation } from 'react-i18next';
import { ContextMenu } from '@app-components/popups/context-menu';
import { PopupPlacement } from '@app-components/popups/base-popup/base-popup';
import { HeaderMenu } from './_header-menu';
import { useLocation } from 'preact-iso/router';
import { cn } from 'react-just-ui/utils/cn';
import { BrandLogo } from '@app-components/brand-logo/brand-logo';
import './header.css';

export const Header = () => {
  const { t } = useTranslation();
  const { path } = useLocation();

  return (
    <header className="header fixed inset-0 bottom-auto z-20 bg-primary">
      <div className="container flex items-center justify-between h-[var(--header-height)]">
        <a href="/" className="flex items-center text-neutral-500 dark:text-gray-300">
          <BrandLogo />
        </a>

        <nav className="main-menu ml-6 mr-auto">
          <a href="/nodes" className={cn('nav-link', { active: path.startsWith('/nodes') })}>
            <i className="icon icon-connection mr-2"/>
            {t('devises')}
          </a>
          <a href="/users" className={cn('nav-link', { active: path.startsWith('/users') })}>
            <i className="icon icon-users mr-2"/>
            {t('users')}
          </a>
          <a href="/acl" className={cn('nav-link', { active: path.startsWith('/acl') })}>
            <i className="icon icon-lock mr-2"/>
            {t('access_controls')}
          </a>
          <a href="/tokens" className={cn('nav-link', { active: path.startsWith('/tokens') })}>
            <i className="icon icon-key mr-2"/>
            {t('tokens')}
          </a>
          <a href="/metrics" className={cn('nav-link', { active: path.startsWith('/metrics') })}>
            <i className="icon icon-metrics mr-2"/>
            {t('metrics')}
          </a>
        </nav>

        <div className="config">
          <ContextMenu
            placement={PopupPlacement.BOTTOM}
            Menu={HeaderMenu}
          >
            <button type="button" className="btn btn-config">
              <i className="icon icon-settings text-[26px] leading-[26px] block"/>
            </button>
          </ContextMenu>
        </div>
      </div>
    </header>
  );
}