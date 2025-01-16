import { FC, useContext } from 'react';
import { Link } from '@tanstack/react-router';
import { Trans } from 'react-i18next';
import { BrandLogo } from '../brand-logo/brand-logo.tsx';
import { ContextMenu } from '../popups/context-menu.tsx';
import { PopupPlacement } from '../popups/popup-base/_common.ts';
import ApplicationContext from '../../context/application/application.context.ts';
import { HeaderMenu } from './_header-menu.tsx';
import './header.css';

export const Header: FC = () => {
  const { isAuthorized } = useContext(ApplicationContext);

  return (
    <header className="header bg-primary dark:border-gray-800 border-b-primary z-10 relative">
      <div className="container flex items-center justify-between h-[60px]">
        <Link className="flex items-center text-neutral-500 dark:text-gray-300" to="/">
          <BrandLogo size={34} />
        </Link>

        {isAuthorized ? (
          <nav className="main-menu ml-6 mr-auto">
            <Link to="/machines" className="nav-link">
              <i className="icon icon-connection mr-2"/>
              <Trans i18nKey="machines"/>
            </Link>
            <Link to="/users" className="nav-link">
              <i className="icon icon-users mr-2"/>
              <Trans i18nKey="users"/>
            </Link>
            <Link to="/acl" className="nav-link">
              <i className="icon icon-lock mr-2"/>
              <Trans i18nKey="access_controls"/>
            </Link>
            <Link to="/tokens" className="nav-link">
              <i className="icon icon-key mr-2"/>
              <Trans i18nKey="tokens"/>
            </Link>
            <Link to="/metrics" className="nav-link">
              <i className="icon icon-metrics mr-2"/>
              <Trans i18nKey="metrics"/>
            </Link>
          </nav>
        ) : null}


        {isAuthorized ? (
          <div className="config">

            <ContextMenu
              placement={PopupPlacement.BOTTOM}
              menu={() => <HeaderMenu/>}
            >
              <button type="button" className="jj-btn btn-config">
                <i className="icon icon-settings text-[26px] leading-[26px] block"/>
              </button>
            </ContextMenu>
          </div>
        ) : null}
      </div>
    </header>
  );
}