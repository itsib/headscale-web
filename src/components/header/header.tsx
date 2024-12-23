import { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { useAppAuth } from '../../hooks/use-app-auth.ts';
import { BrandLogo } from '../brand-logo/brand-logo.tsx';
import './header.css';
import { ContextMenu } from '../popups/context-menu.tsx';
import { PopupPlacement } from '../popups/popup-base/_common.ts';
import { HeaderMenu } from './_header-menu.tsx';

export const Header: FC = () => {
  const [authorized] = useAppAuth();

  return (
    <header className="header bg-primary dark:border-gray-800 border-b-primary">
      <div className="container flex items-center justify-between h-[60px]">
        <Link className="flex items-center text-neutral-500 dark:text-gray-300" to="/">
          <BrandLogo size={34} />
        </Link>

        {authorized ? (
          <nav className="main-menu ml-6 mr-auto">
            <NavLink to="/machines" className="nav-link">
              <i className="icon icon-connection mr-2"/>
              <Trans i18nKey="machines"/>
            </NavLink>
            <NavLink to="/users" className="nav-link">
              <i className="icon icon-users mr-2"/>
              <Trans i18nKey="users"/>
            </NavLink>
            <NavLink to="/acl" className="nav-link">
              <i className="icon icon-lock mr-2"/>
              <Trans i18nKey="access_controls"/>
            </NavLink>
            <NavLink to="/tokens" className="nav-link">
              <i className="icon icon-key mr-2"/>
              <Trans i18nKey="tokens"/>
            </NavLink>
            <NavLink to="/metrics" className="nav-link">
              <i className="icon icon-metrics mr-2"/>
              <Trans i18nKey="metrics"/>
            </NavLink>
          </nav>
        ) : null}


        {authorized ? (
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